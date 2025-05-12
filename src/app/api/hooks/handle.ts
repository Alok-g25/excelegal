import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import { uid } from "uid";
import { revalidatePath } from "next/cache";
import { parsePhoneNumber } from "libphonenumber-js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const handleResponse = {
    duplicateCategoryName: {
        success: false,
        code: 409,
        message: `Category name already exists. Please choose a different name.`
    },
    currentpasswordIncorect: {
        success: false,
        code: 400,
        message: `Current password is incorrect.`
    },
    itemNotFound: (key: any) => ({
        success: false,
        code: 404,
        message: `No ${key} found.`
    }),
    itemsNotFound: (key: any) => ({
        success: false,
        code: 404,
        message: `No ${key} available.`
    }),
    studentNotFound: {
        success: false,
        code: 404,
        message: `Student not found`
    },
    missingToken: {
        success: false,
        code: 401,
        message: `Unauthorized access. Token missing.`
    },
    incorrectCredentials: {
        success: false,
        code: 404,
        message: 'User not found. Please check your credentials and try again.'
    },
    incorrectPassword: {
        success: false,
        code: 401,
        message: 'Incorrect password. Please double-check your password and try again.'
    },
    invalidEmail: {
        success: false,
        code: 400,
        message: `Please enter a valid email address.`,
    },
    invalidPhone: {
        success: false,
        code: 400,
        message: `Invalid phone number. Please enter a valid phone number.`,
    },
    emailAlreadyUse: {
        success: false,
        code: 400,
        message: `This email address is already in use. Please choose another email or sign in with your existing account.`,
    },
    phoneAlreadyUse: {
        success: false,
        code: 400,
        message: `This phone number is already in use. Please choose another phone number or sign in with your existing account.`,
    },
    invalidLogin: {
        success: false,
        code: 400,
        message: `Invalid login credentials. Please check your email (or phone) and password and try again.`,
    },
    invalidFileType: (key: any) => ({
        success: false,
        code: 400,
        message: `Invalid file type for ${key}. Only image files are accepted.`,
    }),
    mkdirError: (key: any) => ({
        success: false,
        code: 400,
        message: `Error creating ${key} directory.`,
    }),
    insufficientPermissions: () => {
        const response = NextResponse.json({
            success: false,
            code: 401,
            message: `Unauthorized access. Insufficient permissions.`
        })
        response.cookies.delete('token');
        return response
    },
    unAuthorized: (error: any) => ({
        success: false,
        code: 401,
        message: `Unauthorized access. Please ensure you are authenticated and have appropriate permissions.`,
        error: error.message,
    }),
    serverError: (error: any) => ({
        success: false,
        code: 500,
        message: `Internal server error. Please try again later.`,
        error: error.toString(),
    }),
    handleCatchError: (error: any) => {
        if (error?.name === `JsonWebTokenError` || error?.name === `TokenExpiredError` || error?.name === `TokenExpiredError`) {
            const response = NextResponse.json(handleResponse.unAuthorized(error));
            response.cookies.delete('token');
            return response
        } else {
            return NextResponse.json(handleResponse.serverError(error));
        }
    }
};

export const fileUpload = async (file: File[], directory: string): Promise<string> => {
    try {
        const profileName = `${uid(32)}.${file[0].type.split('/')[1]}`;
        const arrayBuffer = await file[0].arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await fs.writeFile(`${directory}${profileName}`, buffer);
        revalidatePath("/");
        return profileName;
    } catch (error) {
        throw new Error('File upload failed');
    }
};

export const unlinkFile = async (directory: string, fileName: string): Promise<void> => {
    try {
        await fs.unlink(`${directory}${fileName}`);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

function validatePhoneNumber(phoneNumber: string) {
    try {
        const parsedNumber = parsePhoneNumber(phoneNumber);
        return parsedNumber && parsedNumber.isValid();
    } catch (error) {
        return false;
    }
}

function objectIdValidation(value: any, key: any) {
    if (mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(value);
    } else {
        return NextResponse.json({ success: false, code: 400, message: `Invalid ${key} ID.` })
    }
}

interface TokenValidationSuccess {
    decoded: any;
}

interface TokenValidationFailure {
    success: boolean;
    code: number;
    message: string;
}

type TokenValidationResult = TokenValidationSuccess | TokenValidationFailure;

export async function validateToken(request: NextRequest): Promise<TokenValidationResult> {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return handleResponse.missingToken
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return { decoded };
}

export const useHandler = () => {
    return {
        handleResponse,
        fileUpload,
        unlinkFile,
        validatePhoneNumber,
        validateToken,
        objectIdValidation
    };
};
