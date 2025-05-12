import * as TYPES from '../actions/types'

const initialState = {
    courses: [],
}

const courseReducer = (state = initialState, action:any) => {
    const prevState = { ...state }
    const { type, payload } = action
    switch (type) {
        case TYPES['COURSE_REDUCER']:
            return {
                ...prevState,
                courses: payload
            }
        default: return { ...prevState }
    }
}

export default courseReducer