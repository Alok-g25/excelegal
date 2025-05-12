import { NextRequest, NextResponse } from "next/server";
var jwt = require('jsonwebtoken');
import fs from 'fs/promises'
import { useDirectory, useHandler } from "../../hooks";
import EnquiryDetailsModel from "../../models/enquiry_details";
import { uid } from "uid";
import path from "path";

export async function POST(req: NextRequest) {
    const { handleResponse, fileUpload, unlinkFile, validatePhoneNumber } = useHandler();
    const { resumePath } = useDirectory();
    let resumeName: string | null = null;
    try {
        const body = await req.formData();
        const resume = (body.get('resume') as string).trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = (body.get('email') as string).trim();
        const phone = (body.get('phone') as string).trim();
        const isValidPhone = validatePhoneNumber(`+91${phone}`);
        if (!emailRegex.test(email)) {
            return NextResponse.json(handleResponse.invalidEmail);
        }
        if (!isValidPhone) {
            return NextResponse.json(handleResponse.invalidPhone);
        }
        const existingEmail = await EnquiryDetailsModel.findOne({ email });
        if (existingEmail) {
            return NextResponse.json({ success: false, code: 400, message: "Your request is already submitted, wait for some time or Apply with different Email id." });
        }
        const existingPhone = await EnquiryDetailsModel.findOne({ phone });
        if (existingPhone) {
            return NextResponse.json({ success: false, code: 400, message: "Your request is already submitted, wait for some time or Apply with different Phone no." });
        }
        const enquiryDetailsModel = new EnquiryDetailsModel();
        enquiryDetailsModel.name = (body.get('name') as string).trim();
        if (!resume) {
            return NextResponse.json({ error: "Resume not received" }, { status: 400 });
        }
        // Remove the Base64 prefix (if present)
        const base64Data = resume.replace(/^data:application\/pdf;base64,/, ""); // Adjust MIME type as necessary

        // Convert Base64 string to buffer
        const buffer = Buffer.from(base64Data, 'base64');

        try {
            await fs.mkdir(resumePath, { recursive: true });
        } catch (mkdirError) {
            return NextResponse.json(handleResponse.mkdirError('resume'));
        }

        const fileName = `${uid(32)}.pdf`
        // Write the buffer to a file
        const filePath = path.join(resumePath, fileName);
        await fs.writeFile(filePath, buffer);

        enquiryDetailsModel.email = email;
        enquiryDetailsModel.phone = phone;
        enquiryDetailsModel.resume = fileName;
        enquiryDetailsModel.os = (body.get('os') as string).trim();
        enquiryDetailsModel.status = true;
        await enquiryDetailsModel.save();
        return NextResponse.json({ success: true, code: 201, message: 'Deatils share successfully.' });
    } catch (error: any) {
        if (resumeName) {
            await unlinkFile(resumePath, resumeName);
        }
        return handleResponse?.handleCatchError(error);
    }
}


