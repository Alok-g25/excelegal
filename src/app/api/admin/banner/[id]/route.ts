import { useDirectory, useHandler } from "@/app/api/hooks";
import AdminModel from "@/app/api/models/admin";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises'
import BannerModel from "@/app/api/models/banner";

export async function GET(request: NextRequest, content: any) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
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

export async function PUT(request: NextRequest, content: any) {
    const { handleResponse, validateToken, fileUpload, unlinkFile } = useHandler();
    const { bannerPath } = useDirectory();
    let imageName: string | null = null;
    let oldImageName: string | null = null;
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const bannerId = content?.params?.id;
            let bannerModel: any = await BannerModel.findById(bannerId);
            if (!bannerModel) {
                return NextResponse.json(handleResponse.itemNotFound('banner'));
            }
            const body: any = await request.formData();
            const nonEditableFields = [''];
            const updateFields: any = {};
            for (const [name, value] of body.entries()) {
                if (!nonEditableFields.includes(name)) {
                    updateFields[name] = value;
                }
            }
            const image: any = body.getAll('image')
            if (image[0]?.size) {
                if (image[0].type.startsWith('image/')) {
                    oldImageName = bannerModel.image;
                    try {
                        await fs.mkdir(bannerPath, { recursive: true });
                    } catch (mkdirError) {
                        return NextResponse.json(handleResponse.mkdirError('image'));
                    }
                    imageName = await fileUpload(image, bannerPath);
                    updateFields['image'] = imageName;
                } else {
                    return NextResponse.json(handleResponse.invalidFileType('image'));
                }
            } 
                bannerModel = await BannerModel.findByIdAndUpdate(bannerId, updateFields, { new: true });
                const protocol = request.headers.get('x-forwarded-proto') || 'http';
                const host = request.headers.get('host');
                const fullImageUrl = `${protocol}://${host}/banners/${bannerModel.image}`;
                const bannerWithFullUrl = {
                    ...bannerModel.toObject(),
                    image: fullImageUrl
                };
                if (oldImageName && imageName) {
                    unlinkFile(bannerPath, oldImageName);
                }
                return NextResponse.json({ success: true, data: bannerWithFullUrl, message: 'Banner successfully updated.' });
            
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        if (imageName) {
            unlinkFile(bannerPath, imageName);
        }
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}

export async function DELETE(request: NextRequest, content: any) {
    const { handleResponse, validateToken, unlinkFile } = useHandler();
    const { bannerPath } = useDirectory();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const bannerId = content?.params?.id;
            const bannerModel: any = await BannerModel.findById(bannerId);
            if (!bannerModel) {
                return NextResponse.json(handleResponse.itemNotFound('banner'));
            }
            const imageName = bannerModel?.image
            if (imageName) {
                unlinkFile(bannerPath, imageName);
            }
            await BannerModel.findByIdAndDelete(bannerId);
            return NextResponse.json({ success: true, message: 'Banner successfully deleted.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}
