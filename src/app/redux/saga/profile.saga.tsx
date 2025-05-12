import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import { EDIT_PROFILE, GET_PROFILE, GET_PROFILE_RED } from "../actions/types";
import { END_POINTS } from "@/app/utils/config";

function* getProfile(): Generator<any, void, any> {
  return yield axios.get(END_POINTS.PROFILE, { withCredentials: true });
}

function* getProfileSaga(): Generator<any, void, any> {
  try {
    const response = yield call(getProfile);
    // console.log("profile saga", response.data);
    // console.log(response.data.profile)
    if (response?.data?.success) {
      yield put({ type: GET_PROFILE_RED, payload: response?.data?.profile });
    }
  } catch (error) {
    //handle error
  }
}

function* editProfile(payload: any): Generator<any, any, any> {
  // console.log("saga--->",payload);
  let formData = new FormData();
  Object.keys(payload).forEach((element) => {
    formData.append(element, payload[element]);
  });

  return yield axios.put(END_POINTS.PROFILE, formData, {
    withCredentials: true,
  });
}

export function* editProfileSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(editProfile, action?.payload);
    console.log(response);
    action.callBack(response);
  } catch (error) {
    action.callback(error);
  }
}

export function* profileSaga(): Generator<any, void, any> {
  yield takeLatest(GET_PROFILE, getProfileSaga);
  yield takeLatest(EDIT_PROFILE, editProfileSaga);
}

export default profileSaga;
