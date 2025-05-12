import * as TYPES from '../actions/types'

const initialState = {
    staffData: [],
}

const staffReducer = (state = initialState, action:any) => {
    const prevState = { ...state }
    const { type, payload } = action
    switch (type) {
        case TYPES[TYPES.LIST_STAFF_RED]:
            return {
                ...prevState,
                staffData: payload
            }
        default: return { ...prevState }
    }
}

export default staffReducer