import nodemailer from "nodemailer";
export async function sendEmail(email,otp) {
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.userEmail,
            pass:process.env.passKey
        }
    });

    const mailOtp={
        from:process.env.userEmail,
        to:email,
        subject:'Otp for verification',
        text:`Your OTP code is ${otp}. It is valid for 5 minutes.`
    }
    
    try {
        const result=await transporter.sendMail(mailOtp)
        console.log(`email sent successfully ${email}`);
        
    } catch (error) {
        console.log(error);
        console.log(`email sent failed ${error}`);

        
        
    }
    
}
export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
