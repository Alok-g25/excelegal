import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../hooks";
import AdminModel from "../../models/admin";
import fs from 'fs/promises'
import BannerModel from "../../models/banner";

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
            const bannersList = await BannerModel.find().sort({ created_at: -1 })
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const categoriesWithFullUrls = bannersList.map(banner => ({
                ...banner.toObject(),
                image: `${protocol}://${host}/banners/${banner.image}`
            }));
            if (bannersList.length === 0) {
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

export async function POST(request: NextRequest) {
    const { handleResponse, validateToken, fileUpload, unlinkFile } = useHandler();
    const { bannerPath } = useDirectory()
    let imageName: string | null = null;
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const bannerModel = new BannerModel();
            const body = await request.formData();
            const image = body.getAll('image') as File[];         
            bannerModel.description = body.get('description') as string;
            try {
                await fs.mkdir(bannerPath, { recursive: true });
            } catch (mkdirError) {
                return NextResponse.json(handleResponse.mkdirError('banners'));
            }
            if (image[0]?.size) {
                if (image[0].type.startsWith('image/')) {
                    imageName = await fileUpload(image, bannerPath);
                    bannerModel.image = imageName;
                } else {
                    return NextResponse.json(handleResponse.invalidFileType('banners'));
                }
            }
            bannerModel.status = true;
            const result = await bannerModel.save()
            return NextResponse.json({ success: true, code: 201, data: result, message: 'Banner add successfully.', });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        if (imageName) {
            unlinkFile(bannerPath, imageName);
        }
        return handleResponse?.handleCatchError(error);
    }
}
