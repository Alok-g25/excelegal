import { useHandler } from "@/app/api/hooks";
import CategoryModel from "@/app/api/models/category";
import StudentModel from "@/app/api/models/student";
import { NextRequest, NextResponse } from "next/server";

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