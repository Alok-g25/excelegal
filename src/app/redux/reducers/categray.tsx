import * as TYPES from '../actions/types'

const initialState = {
    category: [],
}

const categoryReducer = (state = initialState, action:any) => {
    const prevState = { ...state }
    const { type, payload } = action
    switch (type) {
        case TYPES['LIST_CATEGORY_RED']:
            return {
                ...prevState,
                category: payload
            }
        default: return { ...prevState }
    }
}

export default categoryReducer