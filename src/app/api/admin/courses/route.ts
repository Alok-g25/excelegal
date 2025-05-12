import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../hooks";
import AdminModel from "../../models/admin";
import fs from 'fs/promises'
import CoursesModel from "../../models/courses";
require('@/app/api/models/category')
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
            const totalCourses = await CoursesModel.countDocuments();
            const totalPages = Math.ceil(totalCourses / length);
            const skip = (page - 1) * length;
            const coursesList = !page.length ? await CoursesModel.find().populate('category').sort({ created_at: -1 }) : await CoursesModel.find().populate('category').skip(skip).limit(length).sort({ created_at: -1 });
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const coursesWithFullUrls = coursesList.map(courses => ({
                ...courses.toObject(),
                image: `${protocol}://${host}/uploads/${courses.image}`
            }));
            if (coursesList.length === 0) {
                return NextResponse.json(handleResponse.itemsNotFound('Courses'));
            }
            return NextResponse.json({ success: true, code: 201, data: !page.length ? { courses: coursesWithFullUrls } : { courses: coursesWithFullUrls, totalPages, currentPage: page, totalCourses } });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}

export async function POST(request: NextRequest) {
    const { handleResponse, validateToken, objectIdValidation, fileUpload, unlinkFile } = useHandler();
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
            const coursesModel = new CoursesModel();
            const body = await request.formData();
            const image = body.getAll('image') as File[];
            coursesModel.category = objectIdValidation(body.get('category'), 'category')
            coursesModel.name = body.get('name') as string;
            try {
                await fs.mkdir(uploadPath, { recursive: true });
            } catch (mkdirError) {
                return NextResponse.json(handleResponse.mkdirError('uploads'));
            }
            if (image[0]?.size) {
                if (image[0].type.startsWith('image/')) {
                    imageName = await fileUpload(image, uploadPath);
                    coursesModel.image = imageName;
                } else {
                    return NextResponse.json(handleResponse.invalidFileType('uploads'));
                }
            }
            coursesModel.description = body.get('description') as string;
            coursesModel.status = true;
            const result = await coursesModel.save()
            return NextResponse.json({ success: true, code: 201, data: result, message: 'Course created successfully.', });
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
