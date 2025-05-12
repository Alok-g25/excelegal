import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
import { useHandler } from "../../hooks";
import StudentModel from "../../models/student";

export async function POST(req: NextRequest) {
    const { handleResponse, validatePhoneNumber } = useHandler();
    try {
        const body = await req.formData();
        const emailPhone = body.get('email.phone') as string;
        const password = body.get('password') as string;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidPhone = validatePhoneNumber(`+91${emailPhone}`);
        let existingUser;
        if (emailRegex.test(emailPhone)) {
            existingUser = await StudentModel.findOne({ email: emailPhone });
        } else if (isValidPhone) {
            existingUser = await StudentModel.findOne({ phone: emailPhone });
        } else {
            return NextResponse.json(handleResponse.invalidLogin);
        }
        if (!existingUser) {
            return NextResponse.json(handleResponse.incorrectCredentials);
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return NextResponse.json(handleResponse.incorrectPassword);
        }
        const payload = {
            id: existingUser?._id,
            name: existingUser?.name,
            email: existingUser?.email,
        };
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE });
        const response = NextResponse.json({ success: true, code: 200, message: 'Login successful. Welcome back!' });
        response.cookies.set('token', token, {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return response;
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
