import StudentModel from "../../models/student";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const body = await req.formData();
        const otp = body.get('resetPasswordOTP') as string;
        let existingUser = await StudentModel.findOne({ resetPasswordOTP: otp});
        if(!existingUser){
            return NextResponse.json({success: false, status: 400, message: "The OTP you entered is invalid. Please try again or request a new OTP."});
        }
        if(Date.now() > existingUser.otpExpires){
            return NextResponse.json({success: false, status: 400, message: "Your OTP has expired. Please request a new one to proceed."});   
        }

         existingUser.resetPasswordOTP=null
         existingUser.otpExpires=null
         await existingUser.save()
        return NextResponse.json({ success: true, status: 200, message: "OTP verified successfully." });

    } catch (error) {
        return NextResponse.json({ success: false, status: 500, message: "Internal Server Error" });
    }
}
