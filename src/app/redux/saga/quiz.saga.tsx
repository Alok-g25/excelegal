import { END_POINTS } from "@/app/utils/config";
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import { ADD_QUIZ, APPROVAL, DELETE_QUIZ, GET_QUIZ, SINGLE_QUIZ, UPDATE_QUIZ } from "../actions/types";


function* quizSaga(payload: any): Generator<any, void, any> {
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  return yield axios.post(END_POINTS.QUIZ, formData, {
    withCredentials: true,
  });
}
function* addQuizSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(quizSaga, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}



function* getQuiz(payload:any): Generator<any, void, any> {
  return yield axios.get(payload.length? `${END_POINTS.QUIZ}?page=${payload.page}&length=${payload.length}`:END_POINTS.QUIZ);
}
function* getQuizSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getQuiz,action?.payload);
        action.callBack(response)   
  } catch (error) {
    action.callBack(error);
  }
}

function* singleQuiz(payload: any): Generator<any, void, any> {
  return yield axios.get(`${END_POINTS.QUIZ}/${payload}`);
}
function* singleQuizSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(singleQuiz, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

function* updateQuiz(payload: any): Generator<any, void, any> {
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  return yield axios.put(`${END_POINTS.QUIZ}/${payload._id}`, formData, {
    withCredentials: true,
  });
}
function* updateQuizSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(updateQuiz, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}
function* approvalQuiz(payload: any): Generator<any, void, any> {
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  return yield axios.put(`${END_POINTS.QUIZ}/approval/${payload.id}`, formData, {
    withCredentials: true,
  });
}
function* approvalQuizSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(approvalQuiz, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}


function* deleteQuiz(payload: any): Generator<any, void, any> {
  return yield axios.delete(`${END_POINTS.QUIZ}/${payload}`);
}

function* deleteQuizSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(deleteQuiz, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

export function* QuizSaga(): Generator<any, void, any> {
  yield takeLatest("ADD_QUIZ", addQuizSaga);
  yield takeLatest("GET_QUIZ", getQuizSaga);
  yield takeLatest("SINGLE_QUIZ", singleQuizSaga);
  yield takeLatest("UPDATE_QUIZ", updateQuizSaga);
  yield takeLatest("DELETE_QUIZ", deleteQuizSaga);
  yield takeLatest(APPROVAL, approvalQuizSaga);

}

export default QuizSaga;
