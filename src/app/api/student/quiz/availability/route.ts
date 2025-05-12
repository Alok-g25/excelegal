import { useHandler } from "@/app/api/hooks";
import QuizModel from "@/app/api/models/quiz";
import StudentModel from "@/app/api/models/student";
import { NextRequest, NextResponse } from "next/server";
require('@/app/api/models/courses')
require('@/app/api/models/question')
export const dynamic = "force-dynamic"

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
            const { searchParams } = new URL(request.url);
            const courseId: any = searchParams.get("course")
            const quizList = await QuizModel.find({ course: courseId })
            if (quizList.length === 0) {
                return NextResponse.json({ success: false, code: 404, });
            }
            const result = quizList.map((a => a?.level)).reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});
            return NextResponse.json({ success: true, code: 201, data: result });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
