import { END_POINTS } from "@/app/utils/config";
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "@/app/utils/axiosConfig";
import { ADD_TOPIC, DELETE_TOPIC, GET_TOPIC, SINGLE_TOPIC, UPDATE_TOPIC } from "../actions/types";



function* addTopic(payload:any):Generator<any,void,any>{
    // console.log(payload,"------------------payload")
    let formData=new FormData()
    Object.keys(payload).forEach((element)=>{
        formData.append(element,payload[element])
        console.log(element,payload[element])
    })
    return yield axios.post(END_POINTS.TOPIC,formData,{withCredentials:true})
}
function* addTopicSaga(action:any):Generator<any ,void, any>{
try {
    const response= yield call(addTopic,action?.payload)
    // console.log(response,"response------------------------")
    action.callBack(response);
} catch (error) {
    action.callBack(error)
}
}

// function* listTopic():Generator<any, void,any>{
//         return yield axios.get(END_POINTS.TOPIC)
// }
// function* listTopicSaga(action:any):Generator<any,void,any>{
//     try {
//         const response=yield call(listTopic)
//         console.log("response-------------------",response)
//         action.callBack(response)
//     } catch (error) {
//         action.callBack(error)
//     }
// }

function* getSingleTopic(payload:any):Generator<any,void,any>{
return yield axios.get(`${END_POINTS.TOPIC}/${payload}`)
}
function* getSingleTopicSaga(action:any):Generator<any ,void ,any>{
        try {
            let response=yield call(getSingleTopic,action?.payload)
            action.callBack(response)
        } catch (error) {
            action.callBack(error)
        }
}

function* updateTopic(payload: any): Generator<any, void, any> {
    // console.log(payload,"payloade------------------")
let formData = new FormData();
Object.keys(payload).forEach((element) => {
  formData.append(element, payload[element]);
//   console.log(element,payload[element])
});
return yield axios.put(`${END_POINTS.TOPIC}/${payload._id}`, formData, { withCredentials: true });
}

function* updateTopicSage(action:any):Generator<any,void,any>{
try {
    const response=yield call(updateTopic,action?.payload)
    action.callBack(response)
} catch (error) {
    action.callBack(error)

}
}




function* deleteTopic(payload: any): Generator<any, void, any> {
console.log("pay-----",payload)
return yield axios.delete(`${END_POINTS.TOPIC}/${payload}`);
}

function* deleteTopicSaga(action:any):Generator<any,void,any>{
try {
    const response=yield call(deleteTopic,action?.payload)
    action.callBack(response)
} catch (error) {
    action.callBack(error)

}
}



export function* topicSaga(): Generator<any ,void ,any>{
yield takeLatest("ADD_TOPIC",addTopicSaga)
yield takeLatest("SINGLE_TOPIC",getSingleTopicSaga)
yield takeLatest("UPDATE_TOPIC",updateTopicSage)
yield takeLatest("DELETE_TOPIC",deleteTopicSaga)
// yield takeLatest("GET_TOPIC",listTopicSaga)
}

export default topicSaga;