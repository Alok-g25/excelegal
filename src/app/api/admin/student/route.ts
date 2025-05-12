import { NextRequest, NextResponse } from "next/server";
import {  useHandler } from "../../hooks";
import AdminModel from "../../models/admin";
import StudentModel from "../../models/student";
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
            const totalStudentList = await StudentModel.countDocuments();
            const totalPages = Math.ceil(totalStudentList / length);
            const skip = (page - 1) * length;
            const studentList = !page.length ? await StudentModel.find().sort({ created_at: -1 }) : await StudentModel.find().skip(skip).limit(length).sort({ created_at: -1 });
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            
            const StudentWithFullUrls = studentList.map(student => ({
                ...student.toObject(),
                profile: `${protocol}://${host}/profiles/${student.profile}`
            }));

            if (studentList.length === 0) {
                return NextResponse.json(handleResponse.itemsNotFound('studentList'));
            }
            return NextResponse.json({ success: true, code: 201, data: !page.length ? { studentList: StudentWithFullUrls } : { studentList: StudentWithFullUrls, totalPages, currentPage: page, totalStudentList } });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}

