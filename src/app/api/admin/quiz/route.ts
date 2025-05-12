import { NextRequest, NextResponse } from "next/server";
import { useHandler } from "../../hooks";
import AdminModel from "../../models/admin";
import QuizModel from "../../models/quiz";
import mongoose from "mongoose";
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
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
                const { searchParams } = new URL(request.url);
                const page: any = searchParams.get("page") || 1;
                const length: any = searchParams.get("length") || 10;
                const totalQuizzes = await QuizModel.countDocuments();
                const totalPages = Math.ceil(totalQuizzes / length);
                const skip = (page - 1) * length;
                if(adminProfile.role === 'ADMIN'){
                    const quizList = !page.length ? await QuizModel.find().populate('creator').populate('course').populate('questions').sort({ created_at: -1 }) : await QuizModel.find().populate('creator').populate('course').populate('questions').skip(skip).limit(length).sort({ created_at: -1 });
                    if (quizList.length === 0) {
                        return NextResponse.json(handleResponse.itemsNotFound('Quizzes'));
                    }
                    return NextResponse.json({ success: true, code: 201, data: !page.length ? { Quizzes: quizList } : { Quizzes: quizList, totalPages, currentPage: page, totalQuizzes } });
                }else{
                    const quizList = !page.length ? await QuizModel.find({creator:decoded?.id}).populate('creator').populate('course').populate('questions').sort({ created_at: -1 }) : await QuizModel.find({creator:decoded?.id}).populate('creator').populate('course').populate('questions').skip(skip).limit(length).sort({ created_at: -1 });
                if (quizList.length === 0) {
                    return NextResponse.json(handleResponse.itemsNotFound('Quizzes'));
                }
                return NextResponse.json({ success: true, code: 201, data: !page.length ? { Quizzes: quizList } : { Quizzes: quizList, totalPages, currentPage: page, totalQuizzes } });
                }
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}



export async function POST(request: NextRequest) {
    const { handleResponse, validateToken, objectIdValidation } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const quizModel = new QuizModel();
            const body = await request.formData();
            quizModel.creator = objectIdValidation(body.get('creator'), 'creator')
            quizModel.course = objectIdValidation(body.get('course'), 'course')
            quizModel.level = body.get('level') as string;
            quizModel.name = body.get('name') as string;
            quizModel.no_of_questions = body.get('no_of_questions') as string;
            quizModel.duration = body.get('duration') as string;
            quizModel.weightage = body.get('weightage') as string;
            quizModel.approval_status = adminProfile.role === 'ADMIN' ? "APPROVED" : "PENDING"
            if (body.get('questions')) {
                quizModel.questions = (body.get('questions') as string).split(',').map(id => id.trim()).map(id => new mongoose.Types.ObjectId(id))
            }
            quizModel.status = true;
            const result = await quizModel.save()
            return NextResponse.json({ success: true, code: 201, data: result, message: 'Quiz created successfully.', });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
