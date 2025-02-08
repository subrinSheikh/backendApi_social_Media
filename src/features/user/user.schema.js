import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const userSchema=new mongoose.Schema({
    name:{
      type:String,
      required:true,
      minlength:[6,"Minimum length of name should be more than 5"],
      maxlength:[25,"Maximun length of name should be less than 26"]

    },
    email:{
        type:String,
        required:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Pls enter valid email"]

    },
    password:{
        type:String,
        required:true,
        // validate:{
        //     validator:function(v){
        //         return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!?&%$*])[A-Za-z\d@!?&%$*]{7,}$/.test(v)
        //     },
        //     message:"Password must contain at least 7 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        // }
        // match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!?&%$*])[A-Za-z\d@!?&%$*]{7,}$/,
        //     "Password must contain at least 7 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        // ]    
    },
    gender:{
        type:String,
    },
    avatar:{
        type:String
    },
    loginToken:[{
           token:{
            type:String,
            required: true
           },
           createAt:{
            type:Date,
            default:Date.now()
           }
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
    }]

})
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {  // Ensure this works on a document instance
//         this.password = await bcrypt.hash(this.password, 12);
//     }
//     next();
// });
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Validate the plain password before hashing
        const passwordValidation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!?&%$*])[A-Za-z\d@!?&%$*]{7,}$/;
        if (!passwordValidation.test(this.password)) {
            return next(new Error('Password must contain at least 7 characters, one uppercase letter, one lowercase letter, one number, and one special character.'));
        }

        // Hash the password if validation passes
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});
userSchema.methods.generateToken = async function () {
    // 'this' refers to the document instance (the specific user)
    const token = jwt.sign({ _id: this._id.toString() }, process.env.key, { expiresIn: '2h' });
    this.loginToken.push({ token, createAt: Date.now() });
    console.log("token added in array");
    await this.save();
    return token;
};


