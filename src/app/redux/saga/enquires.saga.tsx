import { END_POINTS } from "@/app/utils/config";
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import {GET_ENQUIRY_DETAILS} from "../actions/types";


function* getEnquiry(payload:any): Generator<any, void, any> {
  return yield axios.get(payload.length? `${END_POINTS.ENQUIRY_DETAILS}?page=${payload.page}&length=${payload.length}`:END_POINTS.ENQUIRY_DETAILS);
}
function* getEnquirySaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getEnquiry,action?.payload);
    // console.log(response?.data?.data?.questions,"__________________________")
        action.callBack(response)   
  } catch (error) {
    action.callBack(error);
  }
}



export function* EnquirySaga(): Generator<any, void, any> {
  yield takeLatest("GET_ENQUIRY_DETAILS", getEnquirySaga);
}

export default EnquirySaga;
