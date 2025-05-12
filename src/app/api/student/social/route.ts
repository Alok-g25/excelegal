import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import fs from 'fs/promises';
import { useDirectory, useHandler } from "../../hooks";
import StudentModel from "../../models/student";

export async function POST(req: NextRequest) {
    const { handleResponse, fileUpload, unlinkFile, validatePhoneNumber } = useHandler();
    const { profilePath } = useDirectory();
    let profileName: string | null = null;
    try {
        const body = await req.formData();
        const socialProvider = body.get('social.provider') as string;
        const socialID = body.get('social.id') as string;
        const email = body.get('email') as string;
        const profile = body.getAll('profile') as File[];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phone = body.get('phone') as string;
        const isValidPhone = validatePhoneNumber(`+91${phone}`);
        if (!emailRegex.test(email)) {
            return NextResponse.json(handleResponse.invalidEmail);
        }
        if (!isValidPhone && phone) {
            return NextResponse.json(handleResponse.invalidPhone);
        }
        let existingSocialUser = null;
        if (socialID) {
            existingSocialUser = await StudentModel.findOne({ 'social.id': socialID });
        }
        if (existingSocialUser) {
            const payload = {
                id: existingSocialUser._id,
                name: existingSocialUser.name,
                email: existingSocialUser.email,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE });
            const response = NextResponse.json({ success: true, code: 201, message: 'Login successful. Welcome back!' });
            response.cookies.set('token', token, {
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return response;
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
        studentModel.name = body.get('name') as string;
        try {
            await fs.mkdir(profilePath, { recursive: true });
        } catch (mkdirError) {
            return NextResponse.json(handleResponse.mkdirError(`profile`));
        }
        if (profile.length) {
            if (profile[0].type.startsWith('image/')) {
                profileName = await fileUpload(profile, profilePath);
                studentModel.profile = profileName;
            } else {
                return NextResponse.json(handleResponse.invalidFileType('profile'));
            }
        }
        studentModel.social.provider = socialProvider;
        studentModel.social.id = socialID;
        studentModel.email = email;
        studentModel.phone = phone;
        studentModel.date_of_birth = body.get('date_of_birth') as string;
        studentModel.pin_code = body.get('pin_code') as string;
        studentModel.os = body.get('os') as string;
        studentModel.status = true;
        const result = await studentModel.save();
        const payload = {
            id: result._id,
            name: result.name,
            email: result.email
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE });
        const response = NextResponse.json({ success: true, code: 201, message: 'Account created successfully.' });
        response.cookies.set('token', token, {
            maxAge: 60 * 60 * 24,
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
        return handleResponse.handleCatchError(error);
    }
}
