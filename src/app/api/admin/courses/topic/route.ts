import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../../hooks";
import AdminModel from "../../../models/admin";
import TopicModel from "../../../models/topic";
require('@/app/api/models/courses')
export const dynamic = "force-dynamic"

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
            const coursesList = await TopicModel.find().populate('course').sort({ created_at: -1 })
            if (coursesList.length === 0) {
                return NextResponse.json(handleResponse.itemsNotFound('Courses'));
            }
            return NextResponse.json({ success: true, code: 201, data: { courses: coursesList } });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}

export async function POST(request: NextRequest) {
    const { handleResponse, validateToken, objectIdValidation, unlinkFile } = useHandler();
    const { uploadPath } = useDirectory()
    let imageName: string | null = null;
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const topicModel = new TopicModel();
            const body = await request.formData();
            topicModel.course = objectIdValidation(body.get('course'), 'course')
            topicModel.name = body.get('name') as string;
            topicModel.description = body.get('description') as string;
            topicModel.status = true;
            const result = await topicModel.save()
            return NextResponse.json({ success: true, code: 201, data: result, message: 'Topic created successfully.', });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        if (imageName) {
            unlinkFile(uploadPath, imageName);
        }
        return handleResponse?.handleCatchError(error);
    }
}
