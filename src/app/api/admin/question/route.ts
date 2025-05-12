import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../hooks";
import AdminModel from "../../models/admin";
import QuestionModel from "../../models/question";
import mongoose from "mongoose";
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
            const { searchParams } = new URL(request.url);
            const page: any = searchParams.get("page") || 1;
            const length: any = searchParams.get("length") || 10;
            const totalQuestions = await QuestionModel.countDocuments();
            const totalPages = Math.ceil(totalQuestions / length);
            const skip = (page - 1) * length;
            const questionsList = !page.length ? await QuestionModel.find().populate('course').sort({ created_at: -1 }) : await QuestionModel.find().populate('course').skip(skip).limit(length).sort({ created_at: -1 });

            if (questionsList.length === 0) {
                return NextResponse.json(handleResponse.itemsNotFound('Questions'));
            }
            return NextResponse.json({ success: true, code: 201, data: !page.length ? { questions: questionsList } : { questions: questionsList, totalPages, currentPage: page, totalQuestions } });
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
            const questionModel = new QuestionModel();
            const body = await request.formData();
            questionModel.course = objectIdValidation(body.get('course'), 'course')
            if (body.get('course')) {
                questionModel.course = (body.get('course') as string).split(',').map(id => id.trim()).map(id => new mongoose.Types.ObjectId(id))
            }  
            questionModel.question = body.get('question') as string;
            questionModel.a = body.get('a') as string;
            questionModel.b = body.get('b') as string;
            questionModel.c = body.get('c') as string;
            questionModel.d = body.get('d') as string;
            questionModel.answer = body.get('answer') as string;
            questionModel.level= body.get('level') as string
            questionModel.status = true;
            const result = await questionModel.save()
            return NextResponse.json({ success: true, code: 201, data: result, message: 'Question created successfully.', });
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
