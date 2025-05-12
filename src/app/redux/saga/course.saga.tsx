import { END_POINTS } from "@/app/utils/config";
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import {
  ADD_COURSE,
  GET_COURSE,
  SINGLE_COURSE,
  DELETE_COURSE,
  UPDATE_COURSE,
  COURSE_REDUCER,
} from "../actions/types";

function* addCourse(payload: any): Generator<any, void, any> {
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  return yield axios.post(END_POINTS.COURSE, formData, {
    withCredentials: true,
  });
}
function* addCourseSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(addCourse, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

function* getCourse(payload: any): Generator<any, void, any> {
  return yield axios.get(
    payload.length
      ? `${END_POINTS.COURSE}?page=${payload.page}&length=${payload.length}`
      : END_POINTS.COURSE
  );
}
function* getCourseSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getCourse, action?.payload);
    // console.log(response?.data?.data?.courses,"------------------------------------saga course")
    action.callBack(response);
    if (response?.data?.success) {
      yield put({
        type: COURSE_REDUCER,
        payload: response?.data?.data?.courses,
      });
    }
  } catch (error) {
    action.callBack(error);
  }
}

function* singleCourse(payload: any): Generator<any, void, any> {
  return yield axios.get(`${END_POINTS.COURSE}/${payload}`);
}
function* singleCourseSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(singleCourse, action?.payload);
    // console.log(response?.data,'----------')
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

function* updateCourse(payload: any): Generator<any, void, any> {
  console.log(payload,"-----------------------------payload")
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  console.log(`${END_POINTS.COURSE}/${payload._id}`)
  return yield axios.put(`${END_POINTS.COURSE}/${payload._id}`, formData, {
    withCredentials: true,
  });
}
function* updateCourseSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(updateCourse, action?.payload);
    console.log(response,"------------------------resoponsecourse")
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}


function* deleteCourse(payload: any): Generator<any, void, any> {
  console.log("pay-----", payload);
  return yield axios.delete(`${END_POINTS.COURSE}/${payload}`);
}

function* deleteCourseSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(deleteCourse, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

export function* courseSaga(): Generator<any, void, any> {
  yield takeLatest("ADD_COURSE", addCourseSaga);
  yield takeLatest("GET_COURSE", getCourseSaga);
  yield takeLatest("SINGLE_COURSE", singleCourseSaga);
  yield takeLatest("UPDATE_COURSE", updateCourseSaga);
  yield takeLatest("DELETE_COURSE", deleteCourseSaga);
}

export default courseSaga;
