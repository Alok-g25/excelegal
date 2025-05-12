import { NextRequest, NextResponse } from "next/server";
import { useHandler } from "../../hooks";
import BannerModel from "../../models/banner";
import StudentModel from "../../models/student";

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
            const categoriesList = await BannerModel.find().sort({ created_at: -1 })
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const categoriesWithFullUrls = categoriesList.map(banner => ({
                ...banner.toObject(),
                image: `${protocol}://${host}/banners/${banner.image}`
            }));
            if (categoriesList.length === 0) {
                return NextResponse.json(handleResponse.itemsNotFound('banners'));
            }
            return NextResponse.json({ success: true, code: 201, data: { banners: categoriesWithFullUrls } })
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}