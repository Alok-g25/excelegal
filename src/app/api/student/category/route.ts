import { NextRequest, NextResponse } from "next/server";
import { useHandler } from "../../hooks";
import CategoryModel from "../../models/category";
import StudentModel from "../../models/student";
import CoursesModel from "../../models/courses";

export async function GET(request: NextRequest) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded;
        if (!decoded) {
            return NextResponse.json(verifyToken);
        }
        const studentProfile = await StudentModel.findById(decoded?.id);
        if (!studentProfile) {
            return handleResponse?.insufficientPermissions();
        }
        const { searchParams } = new URL(request.url);
        const page: any = searchParams.get("page") || 1;
        const length: any = searchParams.get("length") || 10;
        const skip = (page - 1) * length;
        const categoriesWithCourses = await CategoryModel.aggregate([
            {
                $lookup: {
                    from: CoursesModel.collection.name, 
                    localField: '_id',
                    foreignField: 'category',
                    as: 'courses'
                }
            },
            {
                $match: {
                    'courses.0': { $exists: true } 
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "totalCategories" }],
                    categories: [
                        { $skip: skip },
                        { $limit: parseInt(length, 10) },
                        { $sort: { created_at: -1 } }
                    ]
                }
            },
            {
                $project: {
                    categories: 1,
                    totalCategories: { $arrayElemAt: ["$metadata.totalCategories", 0] }
                }
            }
        ]);
        const totalCategories = categoriesWithCourses[0]?.totalCategories || 0;
        const totalPages = Math.ceil(totalCategories / length);
        const categoriesList = categoriesWithCourses[0]?.categories || [];
        if (categoriesList.length === 0) {
            return NextResponse.json(handleResponse.itemsNotFound('categories'));
        }
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const categoriesWithFullUrls = categoriesList.map((category: any) => ({
            ...category,
            image: `${protocol}://${host}/categories/${category.image}`
        }));
        return NextResponse.json({
            success: true,
            code: 201,
            data: {
                categories: categoriesWithFullUrls,
                totalPages,
                currentPage: page,
                totalCategories
            }
        });
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
