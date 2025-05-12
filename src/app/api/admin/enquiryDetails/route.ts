import { NextRequest, NextResponse } from "next/server";
import {  useHandler } from "../../hooks";
import AdminModel from "../../models/admin";
import EnquiryDetails from "../../models/enquiry_details";
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
            const totalEnquiryList = await EnquiryDetails.countDocuments();
            const totalPages = Math.ceil(totalEnquiryList / length);
            const skip = (page - 1) * length;
            const enquiryDetailsList = !page.length ? await EnquiryDetails.find().sort({ created_at: -1 }) : await EnquiryDetails.find().skip(skip).limit(length).sort({ created_at: -1 });
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            
            const enquiriesWithFullUrls = enquiryDetailsList.map(enquiry => ({
                ...enquiry.toObject(),
                resume: `${protocol}://${host}/resume-cv/${enquiry.resume}`
            }));

            if (enquiryDetailsList.length === 0) {
                return NextResponse.json(handleResponse.itemsNotFound('enquiryDetailsList'));
            }
            return NextResponse.json({ success: true, code: 201, data: !page.length ? { enquiryDetailsList: enquiriesWithFullUrls } : { enquiryDetailsList: enquiriesWithFullUrls, totalPages, currentPage: page, totalEnquiryList } });
        } else {
            return handleResponse?.insufficientPermissions()
        }
    } catch (error: any) {
        return handleResponse?.handleCatchError(error);
    }
}

