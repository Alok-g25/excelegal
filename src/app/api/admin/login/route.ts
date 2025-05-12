import { NextRequest, NextResponse } from "next/server";
import AdminModel from "../../models/admin";
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
import { useHandler } from "../../hooks";

export async function OPTIONS(request: Request) {
    const allowedOrigin = request.headers.get("origin");
    const response = new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": allowedOrigin || "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
                "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
            "Access-Control-Max-Age": "86400",
        },
    });
    return response;
}

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
        const existingUser = await AdminModel.findOne({ email });
        if (!existingUser) {
            return NextResponse.json(handleResponse?.incorrectCredentials);
        }
        if (existingUser?.status) {
            const passwordMatch = await bcrypt.compare(password, existingUser.password);
            if (!passwordMatch) {
                return NextResponse.json(handleResponse.incorrectPassword);
            }
            const payload = {
                id: existingUser?._id,
                name: existingUser?.name,
                email: existingUser?.email,
            }
            const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE });
            const response = NextResponse.json({ success: true, code: 200, message: 'Login successful. Welcome back!' });
            response.cookies.set('token', token, {
                maxAge: 7 * 60 * 60 * 24 * 1000,
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return response
        } else {
            return NextResponse.json({ success: false, code: 200, message: 'Access denied.You are not Active, Please contact to Admin !' });
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error)
    }
}