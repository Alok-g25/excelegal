import { NextRequest, NextResponse } from "next/server";
import AdminModel from "../models/admin";
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
import { useHandler } from "../hooks";
// import StaffModel from "../models/staff";

export async function POST(req: NextRequest) {
    const { handleResponse } = useHandler();
    try {
        const body = await req.formData();
        const email = body.get('email') as string;
        const password = body.get('password') as string;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(handleResponse.invalidEmail);
        }
        let existingUser = await AdminModel.findOne({ email });
        // if (!existingUser) {
        //     existingUser = await StaffModel.findOne({ email });
        // }
        if (!existingUser) {
            return NextResponse.json(handleResponse?.incorrectCredentials);
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return NextResponse.json(handleResponse.incorrectPassword);
        }
        const payload = {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
        }
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE });
        const response = NextResponse.json({ success: true, code: 200, message: 'Login successful. Welcome back!' });
        response.cookies.set('token', token, {
            maxAge: 60 * 60 * 24,
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
