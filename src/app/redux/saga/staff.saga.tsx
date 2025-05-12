import { END_POINTS } from "@/app/utils/config";
import { call,put, takeLatest } from "redux-saga/effects";
import { ADD_STAFF, DELETE_STAFF, GET_STAFF, LIST_STAFF_RED, SINGLE_STAFF, UPDATE_STAFF } from "../actions/types";
import axios from "@/app/utils/axiosConfig";

function* addStaff(payload:any): Generator<any, void, any> {
  let formData = new FormData();
  Object.keys(payload).forEach((key) => {
    formData.append(key, payload[key]);
  });

  const response = yield axios.post(END_POINTS.SIGNUP, formData, {
    withCredentials: true,
  });
  
  return response;
}
function* addStaffSaga(action:any): Generator<any, void, any> {
  try {
    const response = yield call(addStaff, action.payload);
    action.callBack(response);
  } catch (error) {
    action.callBack(error);
  }
}


function* getStaff():Generator<any, void,any>{
  return yield axios.get(END_POINTS.ADD_STAFF)
}
function* getStaffSaga(action:any):Generator<any,void,any>{
try {
  const response=yield call(getStaff)
  yield put({ type: LIST_STAFF_RED, payload: response?.data?.data?.categories});

  action.callBack(response)
  if (response?.data?.success) {
    }
} catch (error) {
  action.callBack(error)
}
}



function* singleStaff(payload:any):Generator<any,void,any>{
return yield axios.get(`${END_POINTS.ADD_STAFF}/${payload}`)
}

function* singleStaffSaga(action:any):Generator<any ,void ,any>{
      try {
          let response=yield call(singleStaff,action?.payload)
          action.callBack(response)
      } catch (error) {
          action.callBack(error)
      }
}

function* updateStaff(payload: any): Generator<any, void, any> {
let formData = new FormData();
Object.keys(payload).forEach((element) => {
formData.append(element, payload[element]);
});

console.log(formData,"**************")
return yield axios.put(`${END_POINTS.ADD_STAFF}/${payload._id}`, formData, { withCredentials: true });
}

function* updateStaffSaga(action:any):Generator<any,void,any>{
try {
  const response=yield call(updateStaff,action?.payload)
  action.callBack(response)
} catch (error) {
  action.callBack(error)

}
}




function* deleteStaff(payload: any): Generator<any, void, any> {
return yield axios.delete(`${END_POINTS.ADD_STAFF}/${payload}`);
}

function* deleteStaffSaga(action:any):Generator<any,void,any>{
try {
  const response=yield call(deleteStaff,action?.payload)
  action.callBack(response)
} catch (error) {
  action.callBack(error)

}
}



export function* staffSaga(): Generator<any, void, any> {
  yield takeLatest(ADD_STAFF, addStaffSaga);
  yield takeLatest(GET_STAFF, getStaffSaga);
  yield takeLatest(SINGLE_STAFF, singleStaffSaga);
  yield takeLatest(DELETE_STAFF, deleteStaffSaga);
  yield takeLatest(UPDATE_STAFF, updateStaffSaga);
}

export default staffSaga;
