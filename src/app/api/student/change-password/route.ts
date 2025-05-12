import StudentModel from "../../models/student";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcrypt');


export async function POST(req: NextRequest) {

    try {
        const body = await req.formData();
        const email = (body.get('email') as string).trim();
        const password = (body.get("password") as string).trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, status: 400, message: "Invalid Email Id. Please check your email!" });
        }
        if (!password) {
            return NextResponse.json({ success: false, status: 400, message: "password must be Required" });
        }
        let existingUser = await StudentModel.findOne({ email });
        if (!existingUser) {
            return NextResponse.json({ success: false, status: 400, message: "this email is not exist to database" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword,
            existingUser.resetPasswordOTP = null
        existingUser.otpExpires = null
        await existingUser.save()
        return NextResponse.json({ success: true, status: 200, message: "Password changed succesfully!" });


    } catch (error) {
        return NextResponse.json({ success: false, status: 500, message: "Internal Server Error" });
    }
}
