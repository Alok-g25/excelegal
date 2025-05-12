import { END_POINTS } from "@/app/utils/config";
import { call, takeLatest } from "redux-saga/effects";
import { CHANGE_PASSWORD, LOGIN_ACTION, LOGOUT } from "../actions/types";
import axios from "@/app/utils/axiosConfig";

function* login(payload: any): Generator<any, any, any> {
  // console.log("from saga page",payload)
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  return yield axios.post(END_POINTS.LOGIN, formData, {
    withCredentials: true
  });
}

export function* loginSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(login, action.payload);

    action.callBack(response);
  } catch (error) {
    console.error("Login failed:", error);
    action.callBack(error);
  }
}

function* logout(): Generator<any, any, any> {
  return yield axios.post(END_POINTS.LOGOUT,{},{withCredentials: true});
}

export function* logoutSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(logout);
    action.callBack(response);
  } catch (error) {
    console.error("Login failed:", error);
    action.callBack(error);
  }
}

function* passwordSaga(payload:any): Generator<any, any, any>{
  let formData=new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  return yield axios.put(END_POINTS.CHANGE_PASS, formData, {
    withCredentials: true
  });

}

function* changePasswordSaga(action:any):Generator<any ,void, any>{
  console.log("actionpayload ----",action.payload)
    try {
      const response = yield call(passwordSaga, action.payload);
      action.callback(response)
    } catch (error) {
      console.log("password does not change : ",error)
      action.callBack(error)
    }
}

export function* authSaga(): Generator<any, void, any> {
  yield takeLatest(LOGIN_ACTION, loginSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(CHANGE_PASSWORD, changePasswordSaga);
}

export default authSaga;
