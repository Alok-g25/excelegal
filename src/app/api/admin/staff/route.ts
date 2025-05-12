import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../hooks";
import AdminModel from "../../models/admin";

export async function GET(request: NextRequest) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded;

        if (!decoded) {
            return NextResponse.json(verifyToken);
        }

        const adminProfile = await AdminModel.findById(decoded?.id);

        if (adminProfile) {
            if (adminProfile?.role === "ADMIN") {
                const staff = await AdminModel.find({ role: "STAFF" });
                const protocol = request.headers.get('x-forwarded-proto') || 'http';
                const host = request.headers.get('host');
                const staffProfileUrls = staff.map(item => ({
                     ...item.toObject(),
                        profile: `${protocol}://${host}/profiles/${item.profile}`
                }));
                return NextResponse.json({ success: true, code: 201, data:{staffData:staffProfileUrls} });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Access denied. You do not have admin permissions."
                });
            }
        } else {
            return handleResponse?.insufficientPermissions();
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
