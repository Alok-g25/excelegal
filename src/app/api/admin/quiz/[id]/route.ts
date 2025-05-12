import { useHandler } from "@/app/api/hooks";
import AdminModel from "@/app/api/models/admin";
import QuizModel from "@/app/api/models/quiz";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
require('@/app/api/models/courses')
require('@/app/api/models/question')
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
            const quizId = content?.params?.id;
            const quiz = await QuizModel.findById(quizId).populate('course').populate('questions')
            if (!quiz) {
                return NextResponse.json(handleResponse.itemNotFound('quiz'));
            }
            return NextResponse.json({ success: true, code: 201, data: quiz });

        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}

export async function PUT(request: NextRequest, content: any) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const quizId = content?.params?.id;
            let quizModel: any = await QuizModel.findById(quizId);
            if (!quizModel) {
                return NextResponse.json(handleResponse.itemNotFound('quiz'));
            }
            const body: any = await request.formData();
            const nonEditableFields = ['course'];
            const updateFields: any = {};
            for (const [name, value] of body.entries()) {
                if (!nonEditableFields.includes(name)) {
                    updateFields[name] = value;
                }
            }
            updateFields['questions'] = body.get('questions') ? (body.get('questions') as string).split(',').map(id => id.trim()).map(id => new mongoose.Types.ObjectId(id)) : []
            quizModel = await QuizModel.findByIdAndUpdate(quizId, updateFields, { new: true });
            return NextResponse.json({ success: true, data: quizModel, message: 'Quiz successfully updated.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}

export async function DELETE(request: NextRequest, content: any) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const quizId = content?.params?.id;
            const quizModel: any = await QuizModel.findById(quizId);
            if (!quizModel) {
                return NextResponse.json(handleResponse.itemNotFound('quiz'));
            }
            await QuizModel.findByIdAndDelete(quizId);
            return NextResponse.json({ success: true, message: 'Quiz successfully deleted.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}
