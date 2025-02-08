import LikeRepository from "./like.repository.js";

export default class LikeController{
    constructor(){
        this.likeRespo=new LikeRepository();
    }

    async toggleLikes(req,res,next){
        try {
            const id=req.params.id;
            const userId=req.id;
            const {address}=req.body;
            if(address!=='Post' && address !=='Comment'){
                return res.status(400).json({success:false,msg:`Invalid address ${address}`})
            }
            const toggle=await this.likeRespo.postLike(userId,id,address);
            if(toggle.like){
                return res.status(201).json({success:true,msg:"Liked successfully",res:toggle.res})
            }
            return res.status(200).json({success:true,msg:"Unliked successfully",res:toggle.res})

            
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`);
        }
    }
    async getLikes(req,res,next){
        try {
            const id=req.params.id;
            // const userId=req.id;
            const {address}=req.body;
            console.log(req.body,id);
            
            if(address!=='Post' && address !=='Comment'){
                return res.status(400).json({success:false,msg:`Invalid address ${address}`})
            }
            const likes=await this.likeRespo.getLikeForPostComment(id,address);
            return res.status(200).json({
                success: true,
                message: `Likes for ${address} fetched successfully`,
                data: likes,
            });
            
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`);
        }
    }
}