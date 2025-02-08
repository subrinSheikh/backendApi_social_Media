import mongoose from "mongoose";
import  dotenv  from "dotenv";
dotenv.config();
const url=process.env.mongodbUrl;

export const connectingWithMongoose = async()=>{
       try {
        await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("MongoDb connected using mongoose ");
        
       } catch (error) {
        console.log("Error while connecting db");
        console.log(error);
       }
}