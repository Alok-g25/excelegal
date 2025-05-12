import { useDirectory, useHandler } from "@/app/api/hooks";
import AdminModel from "@/app/api/models/admin";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises'
import CoursesModel from "@/app/api/models/courses";
import TopicModel from "@/app/api/models/topic";
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
            const coursesId = content?.params?.id;
            const courses = await CoursesModel.findById(coursesId).populate('category')
            const topicList = await TopicModel.find({course:coursesId}).sort({ created_at: -1 })
            if (!courses) {
                return NextResponse.json(handleResponse.itemNotFound('course'));
            }
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const fullImageUrl = `${protocol}://${host}/uploads/${courses.image}`;
            const categoryWithFullUrl = {
                ...courses.toObject(),
                image: fullImageUrl,
                topics: topicList.length ? topicList : []
            };
            return NextResponse.json({ success: true, code: 201, data: categoryWithFullUrl });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}

export async function PUT(request: NextRequest, content: any) {
    const { handleResponse, validateToken, objectIdValidation, fileUpload, unlinkFile } = useHandler();
    const { uploadPath } = useDirectory();
    let imageName: string | null = null;
    let oldImageName: string | null = null;
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const coursesId = content?.params?.id;
            let coursesModel: any = await CoursesModel.findById(coursesId);
            if (!coursesModel) {
                return NextResponse.json(handleResponse.itemNotFound('course'));
            }
            const body: any = await request.formData();
            const nonEditableFields = [''];
            const updateFields: any = {};
            for (const [name, value] of body.entries()) {
                if (!nonEditableFields.includes(name)) {
                    updateFields[name] = value;
                }
            }
            if (body.get('category')) {
                updateFields['category'] = objectIdValidation(body.get('category'), 'category')
            }
            const image: any = body.getAll('image')
            if (image[0]?.size) {
                if (image[0].type.startsWith('image/')) {
                    oldImageName = coursesModel.image;
                    try {
                        await fs.mkdir(uploadPath, { recursive: true });
                    } catch (mkdirError) {
                        return NextResponse.json(handleResponse.mkdirError('image'));
                    }
                    imageName = await fileUpload(image, uploadPath);
                    updateFields['image'] = imageName;
                } else {
                    return NextResponse.json(handleResponse.invalidFileType('image'));
                }
            }
            coursesModel = await CoursesModel.findByIdAndUpdate(coursesId, updateFields, { new: true });
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const fullImageUrl = `${protocol}://${host}/uploads/${coursesModel.image}`;
            const categoryWithFullUrl = {
                ...coursesModel.toObject(),
                image: fullImageUrl
            };
            if (oldImageName && imageName) {
                unlinkFile(uploadPath, oldImageName);
            }
            return NextResponse.json({ success: true, data: categoryWithFullUrl, message: 'Course successfully updated.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}

export async function DELETE(request: NextRequest, content: any) {
    const { handleResponse, validateToken, unlinkFile } = useHandler();
    const { uploadPath } = useDirectory();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const adminProfile = await AdminModel.findById(decoded?.id);
        if (adminProfile) {
            const coursesId = content?.params?.id;
            const coursesModel: any = await CoursesModel.findById(coursesId);
            if (!coursesModel) {
                return NextResponse.json(handleResponse.itemNotFound('course'));
            }
            const imageName = coursesModel?.image
            if (imageName) {
                unlinkFile(uploadPath, imageName);
            }
            await CoursesModel.findByIdAndDelete(coursesId);
            return NextResponse.json({ success: true, message: 'Course successfully deleted.' });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return NextResponse.json(handleResponse.handleCatchError(error));
    }
}
