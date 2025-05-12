import { END_POINTS } from "@/app/utils/config";
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import { ADD_QUESTION, DELETE_QUESTION, GET_QUESTION, SINGLE_QUESTION, UPDATE_QUESTION,QUESTION_BY_COURSE, LIST_QUESTION_RED} from "../actions/types";


function* questionSaga(payload: any): Generator<any, void, any> {
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  return yield axios.post(END_POINTS.QUESTION, formData, {
    withCredentials: true,
  });
}
function* addQuestionSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(questionSaga, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}



function* getQuestion(payload:any): Generator<any, void, any> {
  return yield axios.get(payload.length? `${END_POINTS.QUESTION}?page=${payload.page}&length=${payload.length}`:END_POINTS.QUESTION);
}
function* getQuestionSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getQuestion,action?.payload);
    // console.log(response?.data?.data?.questions,"__________________________")
        action.callBack(response)   
        if (response?.data?.success) {
          yield put({
            type: LIST_QUESTION_RED,
            payload: response?.data?.data?.questions,
          });
        }
  } catch (error) {
    action.callBack(error);
  }
}

function* singleQuestion(payload: any): Generator<any, void, any> {
  return yield axios.get(`${END_POINTS.QUESTION}/${payload}`);
}
function* singleQuestionSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(singleQuestion, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

function* updateQuestion(payload: any): Generator<any, void, any> {
  // console.log(payload, "payload******************************");

  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });

  // console.log(formData, "formData*************************");
  return yield axios.put(`${END_POINTS.QUESTION}/${payload._id}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data', // Important for FormData handling
    },
  });
}


function* updateQuestionSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(updateQuestion, action?.payload);
    // console.log(response,"*********saga")
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}


function* deleteQuestion(payload: any): Generator<any, void, any> {
  console.log("pay-----", payload);
  return yield axios.delete(`${END_POINTS.QUESTION}/${payload}`);
}

function* deleteQuestionSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(deleteQuestion, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}



function* getQuestionByCourse(payload: any): Generator<any, void, any> {
  
  return yield axios.get(`${END_POINTS.QUESTION_COURSE}/${payload.id}?level=${payload.level}`);
}
function* getQuestionByCourseSaga(action: any): Generator<any, void, any> {
  // console.log(action?.payload,"-------------------")
  try {
    const response = yield call(getQuestionByCourse, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}



export function* QuestionSaga(): Generator<any, void, any> {
  yield takeLatest("ADD_QUESTION", addQuestionSaga);
  yield takeLatest("GET_QUESTION", getQuestionSaga);
  yield takeLatest("SINGLE_QUESTION", singleQuestionSaga);
  yield takeLatest("UPDATE_QUESTION", updateQuestionSaga);
  yield takeLatest("DELETE_QUESTION", deleteQuestionSaga);
  yield takeLatest("QUESTION_BY_COURSE", getQuestionByCourseSaga);
}

export default QuestionSaga;
