import multer from "multer";
const uploadStorageConfiguration=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/upload')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+file.originalname)
    }
});
const uploadImgForPost=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/img')
    },
    filename:(req,file,cb)=>{
        const imgName=new Date().toISOString()+file.originalname
        cb(null,imgName)
    }
});

export const uploadAvatar=multer({storage:uploadStorageConfiguration});
export const uploadImg=multer({storage:uploadImgForPost});