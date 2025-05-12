import { NextRequest, NextResponse } from "next/server";
import { useDirectory, useHandler } from "../../../hooks";
import AdminModel from "../../../models/admin";
import fs from "fs/promises";
import { fileUpload } from "@/app/api/hooks/handle";
const bcrypt = require("bcrypt");

export async function GET(request: NextRequest, content: any) {
  const { handleResponse, validateToken } = useHandler();
  try {
    const verifyToken: any = await validateToken(request);
    const decoded = verifyToken?.decoded;

    if (!decoded) {
      return NextResponse.json(verifyToken);
    }

    const adminProfile = await AdminModel.findById(decoded?.id);

    if (adminProfile) {
      if (adminProfile?.role === "ADMIN") {
        const staffId = content?.params?.id;
        const staff = await AdminModel.findById(staffId);
        if (!staff) {
          return NextResponse.json(handleResponse.itemNotFound("staff"));
        }
        const protocol = request.headers.get("x-forwarded-proto") || "http";
        const host = request.headers.get("host");
        const staffProfileUrls = {
          ...staff.toObject(),
          profile: `${protocol}://${host}/profiles/${staff.profile}`,
        };
        return NextResponse.json({
          success: true,
          code: 201,
          data: staffProfileUrls,
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

export async function DELETE(request: NextRequest, content: any) {
  const { handleResponse, validateToken } = useHandler();
  try {
    const verifyToken: any = await validateToken(request);
    const decoded = verifyToken?.decoded;

    if (!decoded) {
      return NextResponse.json(verifyToken);
    }

    const adminProfile = await AdminModel.findById(decoded?.id);

    if (adminProfile) {
      if (adminProfile?.role === "ADMIN") {
        const staffId = content?.params?.id;
        const staff = await AdminModel.findById(staffId);
        if (!staff) {
          return NextResponse.json(handleResponse.itemNotFound("staff"));
        } else {
          await AdminModel.findByIdAndDelete(staffId);
          return NextResponse.json({
            success: true,
            message: "staff delete successfully",
          });
        }
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


export async function PUT(request: NextRequest, content: any) {
  const { handleResponse, validateToken, fileUpload, unlinkFile } = useHandler();
  const { profilePath } = useDirectory();
  let profileName: string | null = null;
  let oldProfileName: string | null = null;
  try {
    const adminId = content?.params?.id;
    let adminProfile = await AdminModel.findById(adminId);
    if (!adminProfile) {
      return handleResponse?.insufficientPermissions();
    }
    const body: any = await request.formData();
    const nonEditableFields: any = [];
    const updateFields: any = {};
    for (const [name, value] of body.entries()) {
      if (!nonEditableFields.includes(name)) {
        updateFields[name] = value;
      }
    }
    const profile: any = body.getAll("profile") as File[];
    if (profile[0]?.size) {
      if (profile[0].type.startsWith("image/")) {
        oldProfileName = adminProfile.profile;
        try {
          await fs.mkdir(profilePath, { recursive: true });
        } catch (mkdirError) {
          return NextResponse.json(handleResponse.mkdirError("profile"));
        }

        profileName = await fileUpload(profile, profilePath);
        updateFields["profile"] = profileName;
      } else {
        return NextResponse.json(handleResponse.invalidFileType("profile"));
      }
    }
    if (body.get("password")) {
      const password = body.get("password") as string;
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields["password"] = hashedPassword
    };

    adminProfile = await AdminModel.findByIdAndUpdate(
      adminId,
      updateFields,
      { new: true }
    );
    const { ...updatedProfile } = adminProfile.toObject();
    const protocol = request.headers.get("x-forwarded-proto");
    const profileUrl = `${protocol}://${request.headers.get(
      "host"
    )}${"/profiles/"}${updatedProfile.profile}`;
    if (oldProfileName && profileName) {
      unlinkFile(profilePath, oldProfileName);
    }
    return NextResponse.json({
      success: true,
      data: updatedProfile.profile
        ? { ...updatedProfile, profile: profileUrl }
        : updatedProfile,
      message: "User profile successfully updated.",
    });
  } catch (error: any) {

    if (profileName) {
      unlinkFile(profilePath, profileName);
    }
    return handleResponse?.handleCatchError(error);
  }
}
