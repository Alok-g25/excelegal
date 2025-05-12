import { NextRequest, NextResponse } from "next/server";
import { useHandler } from "../../../../hooks";
import QuizModel from "../../../../models/quiz";
import { validateToken } from "@/app/api/hooks/handle";
import AdminModel from "@/app/api/models/admin";

export async function PUT(request: NextRequest, content: any) {
  const { handleResponse } = useHandler();
  try {
    const verifyToken: any = await validateToken(request);
    const decoded = verifyToken?.decoded;

    if (!decoded) {
      return NextResponse.json(verifyToken);
    }

    const adminModel = await AdminModel.findById(decoded?.id);

    if (adminModel) {
      if (adminModel?.role === "ADMIN") {
        const quizId = content?.params?.id;
        let quizModel = await QuizModel.findById(quizId);
        if (!quizModel) {
          return NextResponse.json(handleResponse.itemNotFound("quiz"));
        }

        const body = await request.formData();
        const approval_status: any = body.get("approval_status") as string;
        console.log(approval_status, "******************************");

        quizModel = await QuizModel.findByIdAndUpdate(
          quizId,
          { approval_status: approval_status }, // Corrected update
          { new: true }
        );

        return NextResponse.json({
          success: true,
          code: 201,
          data: quizModel,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Access denied. You do not have admin permissions.",
        });
      }
    } else {
      return handleResponse?.insufficientPermissions();
    }
  } catch (error: any) {
    return handleResponse?.handleCatchError(error);
  }
}
