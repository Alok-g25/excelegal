import { useHandler } from "@/app/api/hooks";
import AdminModel from "@/app/api/models/admin";
import { NextRequest, NextResponse } from "next/server";
import TopicModel from "@/app/api/models/topic";
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
            const topicId = content?.params?.id;
            const topic = await TopicModel.findById(topicId).populate('course')
            if (!topic) {
                return NextResponse.json(handleResponse.itemNotFound('topic'));
            }
            return NextResponse.json({ success: true, code: 201, data: topic });

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
            const topicId = content?.params?.id;
            let topicModel: any = await TopicModel.findById(topicId);
            if (!topicModel) {
                return NextResponse.json(handleResponse.itemNotFound('topic'));
            }
            const body: any = await request.formData();
            const nonEditableFields = ['course'];
            const updateFields: any = {};
            for (const [name, value] of body.entries()) {
                if (!nonEditableFields.includes(name)) {
                    updateFields[name] = value;
                }
            }
            topicModel = await TopicModel.findByIdAndUpdate(topicId, updateFields, { new: true });

            return NextResponse.json({ success: true, data: topicModel, message: 'Topic successfully updated.' });
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
            const topicId = content?.params?.id;
            const topicModel: any = await TopicModel.findById(topicId);
            if (!topicModel) {
                return NextResponse.json(handleResponse.itemNotFound('topic'));
            }
            await TopicModel.findByIdAndDelete(topicId);
            return NextResponse.json({ success: true, message: 'Topic successfully deleted.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}
