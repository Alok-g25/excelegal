import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../hooks";
import AdminModel from "../../models/admin";
import fs from 'fs/promises'

export async function GET(request: NextRequest) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const { password, ...profile } = adminProfile.toObject();
            const protocol = request.headers.get('x-forwarded-proto')
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
        let adminProfile = await AdminModel.findById(decoded?.id);
        if (!adminProfile) {
            return handleResponse?.insufficientPermissions();
        }
        const body: any = await request.formData();
        const nonEditableFields = ['email', 'password',];
        const updateFields: any = {};
        for (const [name, value] of body.entries()) {
            if (!nonEditableFields.includes(name)) {
                updateFields[name] = value;
            }
        }
        const profile:any = body.getAll('profile') as File[];
        if (profile[0]?.size) {
            if (profile[0].type.startsWith('image/')) {
                oldProfileName = adminProfile.profile;
                try {
                    await fs.mkdir(profilePath, { recursive: true });
                } catch (mkdirError) {
                    return NextResponse.json(handleResponse.mkdirError('profile'));
                }

                profileName = await fileUpload(profile, profilePath);
                updateFields['profile'] = profileName;
            } else {
                return NextResponse.json(handleResponse.invalidFileType('profile'));
            }
        }
        adminProfile = await AdminModel.findByIdAndUpdate(decoded?.id, updateFields, { new: true });
        const { password, ...updatedProfile } = adminProfile.toObject();
        const protocol = request.headers.get('x-forwarded-proto');
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
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (!adminProfile) {
            return handleResponse?.insufficientPermissions();
        }
        const profileName = adminProfile.profile;
        if (profileName) {
            unlinkFile(profilePath, profileName);
        }
        await AdminModel.findByIdAndDelete(decoded?.id);
        return NextResponse.json({ success: true, message: 'Profile successfully deleted.' });
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}