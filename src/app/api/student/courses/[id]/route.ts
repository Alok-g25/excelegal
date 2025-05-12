import { useHandler } from "@/app/api/hooks";
import { NextRequest, NextResponse } from "next/server";
import CoursesModel from "@/app/api/models/courses";
import TopicModel from "@/app/api/models/topic";
import StudentModel from "@/app/api/models/student";
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
        const studentProfile = await StudentModel.findById(decoded?.id);
        if (studentProfile) {
            const coursesId = content?.params?.id;
            const courses = await CoursesModel.findById(coursesId).populate('category')
            const topicList = await TopicModel.find({ course: coursesId }).sort({ created_at: -1 })
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
