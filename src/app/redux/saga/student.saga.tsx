import { END_POINTS } from "@/app/utils/config";
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import {GET_STUDENT} from "../actions/types";


function* getStudent(payload:any): Generator<any, void, any> {
  return yield axios.get(payload.length? `${END_POINTS.STUDENT}?page=${payload.page}&length=${payload.length}`:END_POINTS.STUDENT);
}
function* getStudentSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getStudent,action?.payload);
    // console.log(response?.data?.data?.questions,"__________________________")
        action.callBack(response)   
  } catch (error) {
    action.callBack(error);
  }
}



export function* StudentSaga(): Generator<any, void, any> {
  yield takeLatest("GET_STUDENT", getStudentSaga);
}

export default StudentSaga;
