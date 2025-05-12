import * as TYPES from '../actions/types'

const initialState = {
    questions: [],
}

const questionReducer = (state = initialState, action:any) => {
    const prevState = { ...state }
    const { type, payload } = action
    switch (type) {
        case TYPES['LIST_QUESTION_RED']:
            return {
                ...prevState,
                questions: payload
            }
        default: return { ...prevState }
    }
}

export default questionReducer