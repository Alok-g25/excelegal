import { useHandler } from "@/app/api/hooks";
import AttemptedModel from "@/app/api/models/attempted";
import QuestionModel from "@/app/api/models/question";
import QuizModel from "@/app/api/models/quiz";
import StudentModel from "@/app/api/models/student";
import { NextRequest, NextResponse } from "next/server";
require('@/app/api/models/courses')
require('@/app/api/models/question')
require('@/app/api/models/quiz')
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    const { handleResponse, validateToken } = useHandler();
    try {
        const verifyToken: any = await validateToken(request);
        const decoded = verifyToken?.decoded
        if (!decoded) {
            return NextResponse.json(verifyToken)
        }
        const studentProfile = await StudentModel.findById(decoded?.id);
        if (studentProfile) {
            const body = await request.formData();
            const quizId = body.get('quiz') as string;
            const questionId = body.get('question') as string;
            const selected_answer = body.get('selected_answer') as string;
            const timeTaken = body.get('timeTaken') as string;
            const attemptedModel = new AttemptedModel();
            const quiz = await QuizModel.findById(quizId)
            if (!quiz) {
                return NextResponse.json(handleResponse.itemNotFound('Quiz'));
            }
            const attemptedQuestions = await AttemptedModel.find({ student: studentProfile?._id, quiz: quiz?._id })

            if (attemptedQuestions?.length < quiz?.no_of_questions) {
                if (questionId && !quiz?.questions.find((question: any) => question.toString() === questionId)) {
                    return NextResponse.json({ success: false, code: 404, message: 'Invalid question ID' })
                }
                if (questionId && attemptedQuestions.find((item: any) => item?.question.toString() === questionId)) {
                    return NextResponse.json({ success: false, code: 409, message: 'Question has already been attempted' })
                }
                const attemptedQuestionIds = attemptedQuestions.map(attempt => attempt.question.toString());
                const filteredQuestions = quiz?.questions.filter((question: any) => !attemptedQuestionIds.includes(question.toString()));
                const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
                const randomObjectId = filteredQuestions[randomIndex];
                if (!randomObjectId) {
                    return NextResponse.json(handleResponse.itemNotFound('Question'));
                }
                if (!selected_answer && !questionId) {
                    const question = await QuestionModel.findById(randomObjectId)
                    return NextResponse.json({ success: true, code: 201, data: { question, pendingQuestion: quiz?.no_of_questions - attemptedQuestions.length, totalQuestion: quiz?.no_of_questions } });
                }
                attemptedModel.quiz = quiz?._id;
                attemptedModel.student = studentProfile?._id
                attemptedModel.question = questionId
                attemptedModel.selected_answer = selected_answer
                attemptedModel.timeTaken = timeTaken
                attemptedModel.progress = (quiz?.no_of_questions - attemptedQuestions.length) === 1 ? 'success' : 'pending'
                attemptedModel.status = true;
                await attemptedModel.save()
                const updatedquiz = await QuizModel.findById(quiz?._id)
                const updatedAttemptedQuestions = await AttemptedModel.find({ student: studentProfile?._id, quiz: updatedquiz?._id })
                if (updatedAttemptedQuestions)
                    if (updatedAttemptedQuestions?.length < updatedquiz?.no_of_questions) {
                        const updatedAttemptedQuestionIds = updatedAttemptedQuestions.map(attempt => attempt.question.toString());
                        const updatedFilteredQuestions = updatedquiz?.questions.filter((question: any) => !updatedAttemptedQuestionIds.includes(question.toString()));
                        const updateRandomIndex = Math.floor(Math.random() * updatedFilteredQuestions.length);
                        const updatedRandomObjectId = updatedFilteredQuestions[updateRandomIndex];
                        if (!updatedRandomObjectId) {
                            return NextResponse.json(handleResponse.itemNotFound('Question'));
                        }
                        const question = await QuestionModel.findById(updatedRandomObjectId)
                        return NextResponse.json({ success: true, code: 201, data: { question, pendingQuestion: updatedquiz?.no_of_questions - updatedAttemptedQuestions.length, totalQuestion: updatedquiz?.no_of_questions } });
                    } else {
                        const updatedAttemptedQuestions = await AttemptedModel.find({ student: studentProfile?._id, quiz: updatedquiz?._id }).populate('question')
                        const totalMarks = updatedquiz?.weightage * updatedAttemptedQuestions.filter(a => a?.question?.answer === a?.selected_answer).length;
                        const maxMarks = updatedquiz?.no_of_questions * updatedquiz?.weightage;
                        const percentage = (totalMarks / maxMarks) * 100;
                        return NextResponse.json({ success: true, code: 200, data: { totalQuestion: updatedquiz?.no_of_questions, weightage: updatedquiz?.weightage, totalMarks: maxMarks, finalResult: totalMarks, percentage: `${percentage.toFixed(2)}%`, timeTaken: updatedAttemptedQuestions.find(a => a?.timeTaken)?.timeTaken } });
                    }
            } else {
                const attemptedQuestions = await AttemptedModel.find({ student: studentProfile?._id, quiz: quiz?._id }).populate('question')
                const totalMarks = quiz?.weightage * attemptedQuestions.filter(a => a?.question?.answer === a?.selected_answer).length;
                const maxMarks = quiz?.no_of_questions * quiz?.weightage;
                const percentage = (totalMarks / maxMarks) * 100;
                return NextResponse.json({ success: true, code: 200, data: { totalQuestion: quiz?.no_of_questions, weightage: quiz?.weightage, totalMarks: maxMarks, finalResult: totalMarks, percentage: `${percentage.toFixed(2)}%`, timeTaken: attemptedQuestions.find(a => a?.timeTaken)?.timeTaken } });
            }
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}
