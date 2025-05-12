import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../hooks";
import StudentModel from "../../models/student";
import fs from 'fs/promises'
import { uid } from "uid";
import path from "path";

export async function GET(request: NextRequest) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const studentProfile = await StudentModel.findById(decoded?.id);
        if (studentProfile) {
            const { password, ...profile } = studentProfile.toObject();
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const profileUrl = `${protocol}://${request.headers.get('host')}${'/profiles/'}${profile.profile}`;
            return NextResponse.json({ success: true, code: 201, profile: profile.profile ? { ...profile, profile: profileUrl } : profile });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}


export async function PUT(request: NextRequest) {
    const { handleResponse, validateToken, fileUpload, unlinkFile } = useHandler();
    const { profilePath } = useDirectory();
    let profileName: string | null = null;
    let oldProfileName: string | null = null;
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded;
        if (!decoded) {
            return NextResponse.json(verifyToken);
        }
        let adminProfile = await StudentModel.findById(decoded?.id);
        if (!adminProfile) {
            return handleResponse?.insufficientPermissions();
        }
        const body: any = await request.formData();
        const nonEditableFields = ['email', 'password', 'social.provider', 'social.id'];
        const updateFields: any = {};
        for (const [name, value] of body.entries()) {
            if (!nonEditableFields.includes(name)) {
                updateFields[name] = value;
            }
        }
        // const profile: any = body.getAll('profile') as File[];
        const profile = body.get('profile') as string;
        if (profile) {
            // Remove the Base64 prefix (if present)
            const base64Data = profile.replace(/^data:application\/pdf;jpeg,/, ""); // Adjust MIME type as necessary
            // Convert Base64 string to buffer
            const buffer = Buffer.from(base64Data, 'base64');
            try {
                await fs.mkdir(profilePath, { recursive: true });
            } catch (mkdirError) {
                return NextResponse.json(handleResponse.mkdirError('resume'));
            }
            const fileName = `${uid(32)}.jpeg`
            // Write the buffer to a file
            const filePath = path.join(profilePath, fileName);
            await fs.writeFile(filePath, buffer);
            updateFields['profile'] = fileName;
        }
        updateFields['otpExpires']=null;
        updateFields['resetPasswordOTP']=null;
        adminProfile = await StudentModel.findByIdAndUpdate(decoded?.id, updateFields, { new: true });
        const { password, ...updatedProfile } = adminProfile.toObject();
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const profileUrl = `${protocol}://${request.headers.get('host')}${'/profiles/'}${updatedProfile.profile}`;
        if (oldProfileName && profileName) {
            unlinkFile(profilePath, oldProfileName);
        }
        return NextResponse.json({ success: true, data: updatedProfile.profile ? { ...updatedProfile, profile: profileUrl } : updatedProfile, message: 'User profile successfully updated.' });
    } catch (error: any) {
        if (profileName) {
            unlinkFile(profilePath, profileName);
        }
        return handleResponse?.handleCatchError(error);
    }
}

export async function DELETE(request: NextRequest) {
    const { handleResponse, validateToken, unlinkFile } = useHandler();
    const { profilePath } = useDirectory();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded;
        if (!decoded) {
            return NextResponse.json(verifyToken);
        }
        const adminProfile = await StudentModel.findById(decoded?.id);
        if (!adminProfile) {
            return handleResponse?.insufficientPermissions();
        }
        const profileName = adminProfile.profile;
        if (profileName) {
            unlinkFile(profilePath, profileName);
        }
        await StudentModel.findByIdAndDelete(decoded?.id);
        return NextResponse.json({ success: true, message: 'Profile successfully deleted.' });
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}