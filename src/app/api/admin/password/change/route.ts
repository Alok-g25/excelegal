import { useHandler } from "@/app/api/hooks";
import AdminModel from "@/app/api/models/admin";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcrypt');


export async function PUT(request: NextRequest) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const body = await request.formData();
            const currentPassword = body.get('current_password') as string;
            const newPassword = body.get('new_password') as string;
            const passwordMatch = await bcrypt.compare(currentPassword, adminProfile.password);
            if (!passwordMatch) {
                return NextResponse.json(handleResponse.currentpasswordIncorect);
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await AdminModel.findByIdAndUpdate(decoded?.id, { password: hashedNewPassword });
            return NextResponse.json({ success: true, message: 'Password updated successfully.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}