import { NextRequest, NextResponse } from "next/server";
import { useHandler } from "../../hooks";
import AdminModel from "../../models/admin";

export async function POST(request: NextRequest) {
    const { handleResponse, validateToken } = useHandler();
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
        const response = NextResponse.json({ success: true, code: 200, message: 'Logged out successfully.' });
        response.cookies.delete('token');
        return response;
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
