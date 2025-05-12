import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../hooks";
import AdminModel from "../../models/admin";
import CategoryModel from "../../models/category";
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
            const { searchParams } = new URL(request.url);
            const page: any = searchParams.get("page") || 1;
            const length: any = searchParams.get("length") || 10;
            const totalCategories = await CategoryModel.countDocuments();
            const totalPages = Math.ceil(totalCategories / length);
            const skip = (page - 1) * length;
            const categoriesList = !page.length ? await CategoryModel.find().sort({ created_at: -1 }) : await CategoryModel.find().skip(skip).limit(length).sort({ created_at: -1 });
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const categoriesWithFullUrls = categoriesList.map(category => ({
                ...category.toObject(),
                image: `${protocol}://${host}/categories/${category.image}`
            }));
            if (categoriesList.length === 0) {
                return NextResponse.json(handleResponse.itemsNotFound('categories'));
            }
            return NextResponse.json({ success: true, code: 201, data: !page.length ? { categories: categoriesWithFullUrls } : { categories: categoriesWithFullUrls, totalPages, currentPage: page, totalCategories } });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}

export async function POST(request: NextRequest) {
    const { handleResponse, validateToken, fileUpload, unlinkFile } = useHandler();
    const { categoryPath } = useDirectory()
    let imageName: string | null = null;
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const categoryModel = new CategoryModel();
            const body = await request.formData();
            const image = body.getAll('image') as File[];
            categoryModel.name = body.get('name') as string;
            const existingCategory = await CategoryModel.findOne({ name: body.get('name') });
            if (existingCategory) {
                return NextResponse.json(handleResponse.duplicateCategoryName);
            }
            try {
                await fs.mkdir(categoryPath, { recursive: true });
            } catch (mkdirError) {
                return NextResponse.json(handleResponse.mkdirError('categories'));
            }
            if (image[0]?.size) {
                if (image[0].type.startsWith('image/')) {
                    imageName = await fileUpload(image, categoryPath);
                    categoryModel.image = imageName;
                } else {
                    return NextResponse.json(handleResponse.invalidFileType('categories'));
                }
            }
            categoryModel.status = true;
            const result = await categoryModel.save()
            return NextResponse.json({ success: true, code: 201, data: result, message: 'Category created successfully.', });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        if (imageName) {
            unlinkFile(categoryPath, imageName);
        }
        return handleResponse?.handleCatchError(error);
    }
}
