import { useHandler } from "@/app/api/hooks";
import AdminModel from "@/app/api/models/admin";
import { NextRequest, NextResponse } from "next/server";
import QuestionModel from "@/app/api/models/question";
import mongoose from "mongoose";
require('@/app/api/models/courses')
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
            const questionId = content?.params?.id;
            const question = await QuestionModel.findById(questionId).populate('course')
            if (!question) {
                return NextResponse.json(handleResponse.itemNotFound('question'));
            }
            return NextResponse.json({ success: true, code: 201, data: question });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}

export async function PUT(request: NextRequest, content: any) {
    const { handleResponse, validateToken, objectIdValidation } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const questionId = content?.params?.id;
            let questionModel: any = await QuestionModel.findById(questionId);
            if (!questionModel) {
                return NextResponse.json(handleResponse.itemNotFound('question'));
            }
            const body: any = await request.formData();
            const nonEditableFields = [''];
            const updateFields: any = {};
            for (const [name, value] of body.entries()) {
                if (!nonEditableFields.includes(name)) {
                    updateFields[name] = value;
                }
            }
            updateFields['course'] = body.get('course') ? (body.get('course') as string).split(',').map(id => id.trim()).map(id => new mongoose.Types.ObjectId(id)) : []
            
            questionModel = await QuestionModel.findByIdAndUpdate(questionId, updateFields, { new: true });
            return NextResponse.json({ success: true, data: questionModel, message: 'Question successfully updated.' });
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
            const questionId = content?.params?.id;
            const questionModel: any = await QuestionModel.findById(questionId);
            if (!questionModel) {
                return NextResponse.json(handleResponse.itemNotFound('question'));
            }
            await QuestionModel.findByIdAndDelete(questionId);
            return NextResponse.json({ success: true, message: 'Question successfully deleted.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}
