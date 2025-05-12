import { useDirectory, useHandler } from "@/app/api/hooks";
import AdminModel from "@/app/api/models/admin";
import QuestionModel from "@/app/api/models/question";
import { NextRequest, NextResponse } from "next/server";
require('@/app/api/models/category')
export const dynamic = "force-dynamic"

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
            const { searchParams } = new URL(request.url);
            const coursesId = content?.params?.id;
            const level: any = searchParams.get("level")
            const questions = level ? await QuestionModel.find({ course: coursesId, level }).sort({ created_at: -1 }) : await QuestionModel.find({ course: coursesId }).sort({ created_at: -1 })
            if (!questions.length) {
                return NextResponse.json(handleResponse.itemsNotFound('questions'));
            }
            return NextResponse.json({ success: true, code: 201, data: { questions } });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
