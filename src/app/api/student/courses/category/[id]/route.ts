import { useHandler } from "@/app/api/hooks";
import CoursesModel from "@/app/api/models/courses";
import StudentModel from "@/app/api/models/student";
import TopicModel from "@/app/api/models/topic";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: any) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded;
        if (!decoded) {
            return NextResponse.json(verifyToken);
        }
        const studentProfile = await StudentModel.findById(decoded?.id);
        if (!studentProfile) {
            return handleResponse.insufficientPermissions();
        }
        const { searchParams } = new URL(request.url);
        const page: number = parseInt(searchParams.get("page") || "1", 10);
        const length: number = parseInt(searchParams.get("length") || "10", 10);
        const skip = (page - 1) * length;
        const categoryId = context?.params?.id;
        const coursesAggregation = await CoursesModel.aggregate([
            {
                $match: { category: new mongoose.Types.ObjectId(categoryId) }
            },
            {
                $lookup: {
                    from: TopicModel.collection.name,
                    localField: '_id',
                    foreignField: 'course',
                    as: 'topics'
                }
            },
            {
                $match: { 'topics.0': { $exists: true } }
            },
            {
                $sort: { created_at: -1 }
            },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: length }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ]);
        const coursesList = coursesAggregation[0].paginatedResults;
        const totalCourses = coursesAggregation[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCourses / length);
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const coursesWithFullUrls = coursesList.map((course: any) => ({
            ...course,
            image: `${protocol}://${host}/uploads/${course.image}`
        }));

        if (coursesList.length === 0) {
            return NextResponse.json(handleResponse.itemsNotFound('Courses'));
        }
        return NextResponse.json({
            success: true,
            code: 200,
            data: {
                courses: coursesWithFullUrls,
                totalPages,
                currentPage: page,
                totalCourses
            }
        });
    } catch (error: any) {
        console.error("Error in GET request:", error.message);
        return handleResponse.handleCatchError(error);
    }
}