import * as TYPES from '../actions/types'

const initialState = {
    profile: null,
}

const adminReducer = (state = initialState, action:any) => {
    const prevState = { ...state }
    const { type, payload } = action
    switch (type) {
        case TYPES['GET_PROFILE_RED']:
            return {
                ...prevState,
                profile: payload
            }
        default: return { ...prevState }
    }
}

export default adminReducer