import { NextRequest, NextResponse } from "next/server";
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
import fs from "fs/promises";
import AdminModel from "../../models/admin";
import { useDirectory, useHandler } from "../../hooks";

export async function POST(req: NextRequest) {
  const { handleResponse, fileUpload, unlinkFile, validatePhoneNumber } =
    useHandler();
  const { profilePath } = useDirectory();
  let profileName: string | null = null;
  try {
    const body = await req.formData();
    const profile: any = body.getAll("profile") as File[];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = body.get("email") as string;
    const phone = body.get("phone") as string;
    const subRole = body.get("subRole") as string;
    const role = body.get("role");
    const isValidPhone = validatePhoneNumber(`+91${phone}`);
    if (!emailRegex.test(email)) {
      return NextResponse.json(handleResponse.invalidEmail);
    }
    if (!isValidPhone) {
      return NextResponse.json(handleResponse.invalidPhone);
    }
    const existingEmail = await AdminModel.findOne({
      email: body.get("email"),
    });
    if (!existingEmail) {
      const adminModel = new AdminModel();
      adminModel.name = body.get("name") as string;
      try {
        await fs.mkdir(profilePath, { recursive: true });
      } catch (mkdirError) {
        return NextResponse.json(handleResponse.mkdirError("profile"));
      }
      if (profile[0]?.size) {
        if (profile[0].type.startsWith("image/")) {
          profileName = await fileUpload(profile, profilePath);
          adminModel.profile = profileName;
        } else {
          return NextResponse.json(handleResponse.invalidFileType("profile"));
        }
      }
      adminModel.email = body.get("email") as string;
      adminModel.phone = phone;
      const password = body.get("password") as string;
      const hashedPassword = await bcrypt.hash(password, 10);
      adminModel.password = hashedPassword;
      adminModel.role = role;
      adminModel.subRole = subRole;
      adminModel.status = true;
      const result = await adminModel.save();
      const payload = {
        id: result?._id,
        name: result?.name,
        email: result?.email,
      };
      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFE,
      });
      const response = NextResponse.json({
        success: true,
        code: 201,
        message: "Account created successfully.",
      });
      if (role === "ADMIN") {
        response.cookies.set("token", token, {
          maxAge: 60 * 60 * 24,
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return response;
      } else {
        return response;
      }
    } else {
      return NextResponse.json(handleResponse.emailAlreadyUse);
    }
  } catch (error: any) {
    if (profileName) {
      unlinkFile(profilePath, profileName);
    }
    return handleResponse?.handleCatchError(error);
  }
}
