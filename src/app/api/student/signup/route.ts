import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
import fs from 'fs/promises'
import { useDirectory, useHandler } from "../../hooks";
import StudentModel from "../../models/student";

export async function POST(req: NextRequest) {
    const { handleResponse, fileUpload, unlinkFile, validatePhoneNumber } = useHandler();
    const { profilePath } = useDirectory();
    let profileName: string | null = null;
    try {
        const body = await req.formData();
        const profile: any = body.getAll('profile') as File[];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = body.get('email') as string;
        const phone = body.get('phone') as string;
        const isValidPhone = validatePhoneNumber(`+91${phone}`);
        if (!emailRegex.test(email)) {
            return NextResponse.json(handleResponse.invalidEmail);
        }
        if (!isValidPhone) {
            return NextResponse.json(handleResponse.invalidPhone);
        }
        const existingEmail = await StudentModel.findOne({ email });
        if (existingEmail) {
            return NextResponse.json(handleResponse.emailAlreadyUse);
        }
        const existingPhone = await StudentModel.findOne({ phone });
        if (existingPhone) {
            return NextResponse.json(handleResponse.phoneAlreadyUse);
        }
        const studentModel = new StudentModel();
        studentModel.name = (body.get('name') as string).trim();
        try {
            await fs.mkdir(profilePath, { recursive: true });
        } catch (mkdirError) {
            return NextResponse.json(handleResponse.mkdirError('profile'));
        }
        if (profile[0]?.size) {
            if (profile[0].type.startsWith('image/')) {
                profileName = await fileUpload(profile, profilePath);
                studentModel.profile = profileName;
            } else {
                return NextResponse.json(handleResponse.invalidFileType('profile'));
            }
        }
        studentModel.email = email.trim(); // Trim email
        studentModel.phone = phone.trim(); // Trim phone
        studentModel.date_of_birth = (body.get('date_of_birth') as string).trim(); // Trim date_of_birth
        studentModel.pin_code = (body.get('pin_code') as string).trim(); // Trim pin_code
        studentModel.os = (body.get('os') as string).trim(); // Trim os

        const password = (body.get('password') as string).trim(); // Trim password
        const hashedPassword = await bcrypt.hash(password, 10);
        studentModel.password = hashedPassword;

        studentModel.status = true;
        const result = await studentModel.save();
        const payload = {
            id: result?._id,
            name: result?.name,
            email: result?.email
        };
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE });
        const response = NextResponse.json({ success: true, code: 201, message: 'Account created successfully.' });
        response.cookies.set('token', token, {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return response;
    } catch (error: any) {
        if (profileName) {
            await unlinkFile(profilePath, profileName);
        }
        return handleResponse?.handleCatchError(error);
    }
}
