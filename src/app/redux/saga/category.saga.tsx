import { END_POINTS } from "@/app/utils/config";
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import { ADD_CATEGORY,LIST_CATEGORY,LIST_CATEGORY_RED,GET_SINGLE_CATEGORY,DELETE_CATEGORY,UPDATE_CATEGORY } from "../actions/types";

function* addCategory(payload:any):Generator<any,void,any>{
        let formData=new FormData()
        Object.keys(payload).forEach((element)=>{
            formData.append(element,payload[element])
        })
        return yield axios.post(END_POINTS.ADD_CAT,formData,{withCredentials:true})
}
function* addCategorySaga(action:any):Generator<any ,void, any>{
    try {
        const response= yield call(addCategory,action?.payload)
        action.callBack(response);
    } catch (error) {
        action.callBack(error)
    }
}


function* listCategory(payload:any):Generator<any, void,any>{
        return yield axios.get(payload.length? `${END_POINTS.LIST_CAT}?page=${payload.page}&length=${payload.length}`:END_POINTS.LIST_CAT)
}
function* listCategorySaga(action:any):Generator<any,void,any>{
    try {
        const response=yield call(listCategory,action?.payload)
        action.callBack(response)
        if (response?.data?.success) {
            yield put({ type: LIST_CATEGORY_RED, payload: response?.data?.data?.categories});
          }
    } catch (error) {
        action.callBack(error)
    }
}



function* getSingleCategory(payload:any):Generator<any,void,any>{
    return yield axios.get(`${END_POINTS.GET_SINGLE_CAT}/${payload}`)
}

function* getSingleCategorySaga(action:any):Generator<any ,void ,any>{
            try {
                let response=yield call(getSingleCategory,action?.payload)
                action.callBack(response)
            } catch (error) {
                action.callBack(error)
            }
}

function* updateCategory(payload: any): Generator<any, void, any> {
    let formData = new FormData();
    Object.keys(payload).forEach((element) => {
      formData.append(element, payload[element]);
    });
    return yield axios.put(`${END_POINTS.UPDAE_CAT}/${payload._id}`, formData, { withCredentials: true });
  }
  
function* updateCategorySaga(action:any):Generator<any,void,any>{
    try {
        const response=yield call(updateCategory,action?.payload)
        action.callBack(response)
    } catch (error) {
        action.callBack(error)

    }
}




function* deleteCategory(payload: any): Generator<any, void, any> {
    console.log("pay-----",payload)
    return yield axios.delete(`${END_POINTS.UPDAE_CAT}/${payload}`);
  }
  
function* deleteCategorySaga(action:any):Generator<any,void,any>{
    try {
        const response=yield call(deleteCategory,action?.payload)
        action.callBack(response)
    } catch (error) {
        action.callBack(error)

    }
}



export function* categorySaga(): Generator<any ,void ,any>{
    yield takeLatest(ADD_CATEGORY,addCategorySaga)
    yield takeLatest(LIST_CATEGORY,listCategorySaga)
    yield takeLatest(GET_SINGLE_CATEGORY,getSingleCategorySaga)
    yield takeLatest(UPDATE_CATEGORY,updateCategorySaga)
    yield takeLatest(DELETE_CATEGORY,deleteCategorySaga)
}

export default categorySaga;