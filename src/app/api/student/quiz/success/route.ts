import { useHandler } from "@/app/api/hooks";
import AttemptedModel from "@/app/api/models/attempted";
import StudentModel from "@/app/api/models/student";
import { NextRequest, NextResponse } from "next/server";
require('@/app/api/models/courses')
require('@/app/api/models/question')
require('@/app/api/models/quiz')
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const studentProfile = await StudentModel.findById(decoded?.id);
        if (studentProfile) {
            const attemptedQuestions = await AttemptedModel.aggregate([
                { $match: { student: studentProfile?._id, progress: 'success' } },
                { $sort: { created_at: 1 } },
                {
                    $group: {
                        _id: "$course",
                        doc: { $first: "$$ROOT" }
                    }
                },
                { $replaceRoot: { newRoot: "$doc" } },
                {
                    $lookup: {
                        from: "courses",
                        localField: "course",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                { $unwind: "$course" },
                {
                    $project: {
                        _id: 1,
                        created_at: 1,
                        quiz: 1,
                        course: 1,
                        student: 1,
                        question: 1,
                        selected_answer: 1,
                        timeTaken: 1,
                        progress: 1,
                        status: 1
                    }
                }
            ]);
            const attemptedQuiz = await AttemptedModel.find({ student: studentProfile?._id }).populate('quiz').populate('question');
            const courseQuizMapping = attemptedQuestions.map(course => {
                const quizzesForCourse = attemptedQuiz.filter(quiz => quiz?.course.toString() === course?.course?._id.toString() && quiz?.progress === 'success');
                const quizzesForCourseMapping = quizzesForCourse.map(quiz => {
                    const totalMarks = quiz?.quiz?.weightage * attemptedQuiz.filter(a => a?.quiz?._id === quiz?.quiz?._id).filter(a => a?.question?.answer === a?.selected_answer).length;
                    const maxMarks = quiz?.quiz?.no_of_questions * quiz?.quiz?.weightage;
                    const percentage = (totalMarks / maxMarks) * 100;
                    return {
                        quiz: quiz?.quiz,
                        result: { totalQuestion: quiz?.quiz?.no_of_questions, weightage: quiz?.quiz?.weightage, totalMarks: maxMarks, finalResult: totalMarks, percentage: `${percentage.toFixed(2)}%`, timeTaken: attemptedQuiz.find(a => a?.timeTaken)?.timeTaken }
                    }
                })
                const protocol = request.headers.get('x-forwarded-proto') || 'http';
                const host = request.headers.get('host');
                const finalCourse = course?.course
                finalCourse.image = `${protocol}://${host}/uploads/${course?.course.image}`
                return { course: finalCourse, quizzes: quizzesForCourseMapping };
            });
            return NextResponse.json({ success: true, code: 200, data: courseQuizMapping })
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
