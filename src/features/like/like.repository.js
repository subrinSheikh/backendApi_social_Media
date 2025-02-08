import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import ErrorHandling from "../../error/errorHandling.js";
import { postSchema } from "../post/post.schema.js";
import { commentSchema } from "../comment/comment.schema.js";
import { ObjectId } from "mongodb";

const likeModel = mongoose.model('Like', likeSchema)
const postModel = mongoose.model('Post', postSchema)
const commentModel = mongoose.model('Comment', commentSchema);


export default class LikeRepository {


    async postLike(userId, id, address) {
        try {
            if (address === 'Post' || address === 'Comment') {
                const existLike = await likeModel.findOne({ user: userId, likes: id, address });
                if (!existLike) {
                    const like = new likeModel({
                        user: userId,
                        likes: id,
                        address
                    })
                    await like.save();
                    if (address === 'Post') {
                        await postModel.findByIdAndUpdate(id, { $push: { likes: like._id } });
                    } else {
                        await commentModel.findByIdAndUpdate(id, { $push: { likes: like._id } });
                    }
                    return { success: true, like: true, res: like }

                } else {
                    await likeModel.findByIdAndDelete(existLike._id);
                    if (address === 'Post') {
                        await postModel.findByIdAndDelete(id, { $pull: { likes: existLike._id } });
                    } else {
                        await commentModel.findByIdAndDelete(id, { $pull: { likes: existLike._id } });
                    }
                    return { success: true, like: false, res: existLike }
                }
            }


        } catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }
        }
    }
    async getLikeForPostComment(id, address) {
        // try {         
        //   if(address === 'Post'){
        //     const result=await postModel.aggregate([
        //         {
        //           $match:{_id:new mongoose.Types.ObjectId(id),user:new mongoose.Types.ObjectId(userId)}
        //         },
        //         {
        //             $lookup: {
        //               from: "likes",
        //               localField: "_id",
        //               foreignField: "postId",
        //               as: "likes",
        //             },
        //           },
        //     ])

        //   } 

        //     const result = await model.aggregate([
        //         { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match the Post/Comment by ID

        //         // Lookup likes and populate user details
        //         {
        //             $lookup: {
        //                 from: 'likes', // Join with the 'likes' collection
        //                 localField: 'likes',
        //                 foreignField: '_id',
        //                 as: 'likeDetails',
        //             },
        //         },
        //         {
        //             $lookup: {
        //                 from: 'users', // Join with the 'users' collection
        //                 localField: 'likeDetails.user',
        //                 foreignField: '_id',
        //                 as: 'userDetails',
        //             },
        //         },

        //         // Lookup comments (for Posts) or replies (for Comments)
        //         ...(address === 'Post'
        //             ? [
        //                   {
        //                       $lookup: {
        //                           from: 'comments', // Join with the 'comments' collection
        //                           localField: '_id', // Post ID
        //                           foreignField: 'postId', // Reference to Post in Comments
        //                           as: 'comments',
        //                       },
        //                   },
        //               ]
        //             : [
        //                   {
        //                       $lookup: {
        //                           from: 'comments', // Join with the 'comments' collection
        //                           localField: '_id', // Comment ID
        //                           foreignField: 'parentCommentId', // Reference to parent Comment
        //                           as: 'replies',
        //                       },
        //                   },
        //               ]),

        //         // Add counts and project the output
        //         {
        //             $project: {
        //                 _id: 0, // Exclude the ID
        //                 likesCount: { $size: '$likeDetails' }, // Count of likes
        //                 commentsCount: address === 'Post' ? { $size: '$comments' } : { $size: '$replies' }, // Count of comments or replies
        //                 users: '$userDetails', // Populated user details
        //                 comments: address === 'Post' ? '$comments' : '$replies', // Comments (for Posts) or Replies (for Comments)
        //             },
        //         },
        //     ]);

        //     return result[0] || { likesCount: 0, commentsCount: 0, users: [], comments: [] }; // Default response
        // } 
        try {
            if (address === 'Post') {
                const result = await postModel.aggregate([
                    // Match Post or Comment by ID
                    { $match: { _id: new mongoose.Types.ObjectId(id) } },

                    // Lookup Likes (Generic for Post & Comment)
                    {
                        $lookup: {
                            from: "likes",
                            let: { postOrCommentId: "$_id" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$likes", "$$postOrCommentId"] } } },
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "user",
                                        foreignField: "_id",
                                        as: "userDetails",
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        userDetails: { _id: 1, name: 1, email: 1 }, // Include only id, name, and email
                                    },
                                },
                            ],
                            as: "likes",
                        },
                    },

                    // Lookup Comments (Only for Posts)
                    ...(address === "Post"
                        ? [
                            {
                                $lookup: {
                                    from: "comments",
                                    localField: "_id",
                                    foreignField: "postOwner",
                                    as: "comments",
                                },
                            },
                        ]
                        : []),

                    // Project the final output
                    {
                        $project: {
                            _id: 0,
                            likesCount: { $size: "$likes" },
                            commentsCount: address === "Post" ? { $size: "$comments" } : 0,
                            likedUsers: "$likes.userDetails",
                        },
                    },
                ]);

                return result[0] || { likesCount: 0, commentsCount: 0, likedUsers: [] };
            } else {
                const result = await commentModel.aggregate([
                    // Match Comment by ID
                    { $match: { _id: new mongoose.Types.ObjectId(id) } },

                    // Lookup Likes for the Comment
                    {
                        $lookup: {
                            from: "likes",
                            let: { commentId: "$_id" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$likes", "$$commentId"] } } },
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "user",
                                        foreignField: "_id",
                                        as: "userDetails",
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        userDetails: { _id: 1, name: 1, email: 1 }, // Include only id, name, and email
                                    },
                                },
                            ],
                            as: "likes",
                        },
                    },

                    // Lookup Replies (Sub-comments on this Comment)
                    {
                        $lookup: {
                            from: "comments",
                            localField: "_id",
                            foreignField: "comment", // Assuming this field stores replies
                            as: "replies",
                        },
                    },

                    // Project the final output
                    {
                        $project: {
                            _id: 0,
                            likesCount: { $size: "$likes" }, // Count of likes
                            repliesCount: { $size: "$replies" }, // Count of replies (comments on this comment)
                            likedUsers: "$likes.userDetails", // Populated liked users
                        },
                    },
                ]);

                return result[0] || { likesCount: 0, repliesCount: 0, likedUsers: [] };
            }

        }
        catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }
        }
    }
}
