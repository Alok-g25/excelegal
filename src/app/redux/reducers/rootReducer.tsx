import { combineReducers } from 'redux';
import adminReducer from "./admin.reducer"
import categoryReducer from './categray';
import courseReducer from './course.reducer';
import questionReducer from './question.reducer';
import staffReducer from './staff.reducer';

const appReducer = combineReducers({
   admindata: adminReducer,
   categoryData:categoryReducer,
   courseData:courseReducer,
   questionData:questionReducer,
   staffData:staffReducer
})

const rootReducer = (state:any, action:any) => {
    return appReducer(state, action)
}

export default rootReducer
