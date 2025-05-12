import { END_POINTS } from "@/app/utils/config";
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import {
  ADD_BANNER,
  GET_BANNER,
  SINGLE_BANNER,
  DELETE_BANNER,
  UPDATE_BANNER,
} from "../actions/types";

function* addBanner(payload: any): Generator<any, void, any> {
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  return yield axios.post(END_POINTS.BANNER, formData, {
    withCredentials: true,
  });
}

function* addBannerSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(addBanner, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

function* getBanner(): Generator<any, void, any> {
  return yield axios.get(END_POINTS.BANNER)
}
function* getBannerSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getBanner);
    action.callBack(response)
  } catch (error) {
    action.callBack(error);
  }
}

function* singleBanner(payload: any): Generator<any, void, any> {
  return yield axios.get(`${END_POINTS.BANNER}/${payload}`);
}
function* singleBannerSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(singleBanner, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

function* updateBanner(payload: any): Generator<any, void, any> {
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });
  // console.log(`${END_POINTS.BANNER}/${payload._id}`)
  return yield axios.put(`${END_POINTS.BANNER}/${payload._id}`, formData, {
    withCredentials: true,
  });
}

function* updateBannerSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(updateBanner, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}


function* deleteBanner(payload: any): Generator<any, void, any> {
  return yield axios.delete(`${END_POINTS.BANNER}/${payload}`);
}

function* deleteBannerSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(deleteBanner, action?.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}

export function* BannerSaga(): Generator<any, void, any> {
  yield takeLatest("ADD_BANNER", addBannerSaga);
  yield takeLatest("GET_BANNER", getBannerSaga);
  yield takeLatest("SINGLE_BANNER", singleBannerSaga);
  yield takeLatest("UPDATE_BANNER", updateBannerSaga);
  yield takeLatest("DELETE_BANNER", deleteBannerSaga);
}

export default BannerSaga;
