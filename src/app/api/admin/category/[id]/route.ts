import { useDirectory, useHandler } from "@/app/api/hooks";
import AdminModel from "@/app/api/models/admin";
import CategoryModel from "@/app/api/models/category";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises'

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
            const categoryId = content?.params?.id;
            const category = await CategoryModel.findById(categoryId)
            if (!category) {
                return NextResponse.json(handleResponse.itemNotFound('category'));
            }
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const fullImageUrl = `${protocol}://${host}/categories/${category.image}`;
            const categoryWithFullUrl = {
                ...category.toObject(),
                image: fullImageUrl
            };
            if (category) {
                return NextResponse.json({ success: true, code: 201, data: categoryWithFullUrl });
            } else {
                return NextResponse.json(handleResponse.itemNotFound('category'));
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
    const { categoryPath } = useDirectory();
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
            const categoryId = content?.params?.id;
            let categoryModel: any = await CategoryModel.findById(categoryId);
            if (!categoryModel) {
                return NextResponse.json(handleResponse.itemNotFound('category'));
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
                    oldImageName = categoryModel.image;
                    try {
                        await fs.mkdir(categoryPath, { recursive: true });
                    } catch (mkdirError) {
                        return NextResponse.json(handleResponse.mkdirError('image'));
                    }
                    imageName = await fileUpload(image, categoryPath);
                    updateFields['image'] = imageName;
                } else {
                    return NextResponse.json(handleResponse.invalidFileType('image'));
                }
            }
            categoryModel = await CategoryModel.findByIdAndUpdate(categoryId, updateFields, { new: true });
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const fullImageUrl = `${protocol}://${host}/categories/${categoryModel.image}`;
            const categoryWithFullUrl = {
                ...categoryModel.toObject(),
                image: fullImageUrl
            };
            if (oldImageName && imageName) {
                unlinkFile(categoryPath, oldImageName);
            }
            return NextResponse.json({ success: true, data: categoryWithFullUrl, message: 'Category successfully updated.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}

export async function DELETE(request: NextRequest, content: any) {
    const { handleResponse, validateToken, unlinkFile } = useHandler();
    const { categoryPath } = useDirectory();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const categoryId = content?.params?.id;
            const categoryModel: any = await CategoryModel.findById(categoryId);
            if (!categoryModel) {
                return NextResponse.json(handleResponse.itemNotFound('category'));
            }
            const imageName = categoryModel?.image
            if (imageName) {
                unlinkFile(categoryPath, imageName);
            }
            await CategoryModel.findByIdAndDelete(categoryId);
            return NextResponse.json({ success: true, message: 'Category successfully deleted.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}
