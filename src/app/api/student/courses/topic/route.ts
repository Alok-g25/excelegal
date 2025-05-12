import { NextRequest, NextResponse } from "next/server";
import { useHandler } from "../../../hooks";
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