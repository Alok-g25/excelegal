import { useHandler } from "@/app/api/hooks";
import { NextRequest, NextResponse } from "next/server";
import BannerModel from "@/app/api/models/banner";
import StudentModel from "@/app/api/models/student";

export async function GET(request: NextRequest, content: any) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const studentProfile = await StudentModel.findById(decoded?.id);
        if (studentProfile) {
            const bannerId = content?.params?.id;
            const banner = await BannerModel.findById(bannerId)
            if (!banner) {
                return NextResponse.json(handleResponse.itemNotFound('banner'));
            }
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const fullImageUrl = `${protocol}://${host}/banners/${banner.image}`;
            const bannerWithFullUrl = {
                ...banner.toObject(),
                image: fullImageUrl
            };
            if (banner) {
                return NextResponse.json({ success: true, code: 201, data: bannerWithFullUrl });
            } else {
                return NextResponse.json(handleResponse.itemNotFound('banner'));
            }
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
