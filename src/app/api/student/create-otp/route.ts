import StudentModel from "../../models/student";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import { useHandler } from "../../hooks";

// Email sending function
const sendEmail = async (options: any) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: `"MarkleTechAndMedia" <ashutoshkumar90102017@gmail.com>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // Send email asynchronously
    return transporter.sendMail(mailOptions);
};

export async function POST(req: NextRequest) {
    const { handleResponse } = useHandler();

    try {
        const body = await req.formData();
        const email = (body.get('email') as string).trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, status: 400, message: "Invalid Email Id. Please check your email!" });
        }

        let existingUser = await StudentModel.findOne({ email: email });

        if (!existingUser) {
            return NextResponse.json(handleResponse.incorrectCredentials);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 600000);  // OTP valid for 10 minutes
        existingUser.resetPasswordOTP = otp.trim();
        existingUser.otpExpires = expirationTime;

        await existingUser.save();

        // Send OTP email asynchronously
        sendEmail({
            email: email,
            subject: "OTP for Email Verification",
            html: `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                    <table style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden;">
                    <tr>
                        <td style="background-color: #ff6b6b; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0; font-size: 24px;">Password Reset OTP</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px;">
                        <p style="font-size: 16px; line-height: 1.6;">
                            Hello,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            We received a request to reset your password. Use the One-Time Password (OTP) below to proceed with the password reset:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="font-size: 28px; color: #ff6b6b; font-weight: bold;">${otp}</span>
                        </div>
                        <p style="font-size: 16px; line-height: 1.6;">
                            This OTP is valid for the next <b>10 minutes</b>. Please enter it on the password reset page to complete your request.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            If you did not request a password reset, please ignore this email.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            Best regards,<br>
                            The Support Team
                        </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777; font-size: 14px;">
                        &copy; 2024 Your Company. All rights reserved.
                        </td>
                    </tr>
                    </table>
                </body>
            </html>
          `
        }).catch(err => console.error("Email sending failed", err)); // Catch email errors

        return NextResponse.json({ success: true, status: 200, message: "Your OTP has been sent to your email" });

    } catch (error) {
        console.error("Error in OTP generation:", error);
        return NextResponse.json({ success: false, status: 500, message: "Internal Server Error" });
    }
}
