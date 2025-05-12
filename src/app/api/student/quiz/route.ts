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
            const quizList = await QuizModel.find({ course: courseId }).sort({ created_at: -1 })
            const groupedQuizzes = quizList.reduce((acc, quiz) => {
                const level = quiz.level;
                if (!acc[level]) {
                    acc[level] = [];
                }
                acc[level].push(quiz);
                return acc;
            }, {} as { [key: string]: any[] });
            const result = ['easy', 'medium', 'hard'].map(level => ({
                title: level,
                data: groupedQuizzes[level] || []
            }));
            return NextResponse.json({ success: true, code: 201, data: result });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
