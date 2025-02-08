import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { postSchema } from "../post/post.schema.js";
import { ObjectId } from "mongodb";
import ErrorHandling from "../../error/errorHandling.js";

const commentModel = mongoose.model('Comment', commentSchema);
const postModel = mongoose.model('Post', postSchema);
export default class CommentRepository {

    async addComment(postId, userId, comment) {
        try {
            const newComment = new commentModel({
                user: new ObjectId(userId),
                postOwner: new ObjectId(postId),
                comment
            })
            await newComment.save();
            const post = await postModel.findById(postId);
            post.comments.push(newComment._id);
            await post.save();
            return { success: true, res: newComment }


        } catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }

        }
    }
    async getComment(postId,userId) {
        try {
            const commentToFind = await commentModel.find({postOwner:postId}).select('comment -_id');
            console.log(commentToFind);
            
            // const postOfComment = await postModel.findById(commentToFind.postOwner);
            if (commentToFind) {
                    return { success: true, res: commentToFind }
                } 
            
            else {
                return { success: false, error: { msg: "Comment not found", statusCode: 404 } };

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
    async updateComment(commentId, id, comment) {
        try {
            const commentToFind = await commentModel.findById(commentId);
            const postOfComment = await postModel.findById(commentToFind.postOwner);
            if (commentToFind) {
                if (commentToFind.user.toString() === id.toString() || postOfComment.user.toString() === id.toString()) {
                    const update = { $set: { comment } };
                    const commentUpdated = await commentModel.findByIdAndUpdate(commentId, update);
                    return { success: true, res: commentUpdated }
                } else {
                    return { success: false, error: { msg: "you cant update this comment as you never post this comment!nor your comment nor belongs to your post ", statusCode: 404 } }


                }
            }
            else {
                return { success: false, error: { msg: "Comment not found", statusCode: 404 } };

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
    async delComment(commentId, id) {
        try {
            const commentToFind = await commentModel.findById(commentId);
            const postOfComment = await postModel.findById(commentToFind.postOwner);
            if (commentToFind) {
                if (commentToFind.user.toString() === id.toString() || postOfComment.user.toString() === id.toString()) {
                    const commentDeleted = await commentModel.findByIdAndDelete(commentId);
                    await postModel.updateOne({_id:postOfComment._id},
                {
                    $pull:{comments:commentId}
                })
                    return { success: true, res: commentDeleted }
                } else {
                    return { success: false, error: { msg: "you cant delete this comment as you never post this comment!nor your comment nor belongs to your post ", statusCode: 404 } }

                }
            }
            else {
                return { success: false, error: { msg: "Comment not found", statusCode: 404 } };

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

}