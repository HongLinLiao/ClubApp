import { GET_ACTIVITY_DATA } from '../actions/ActivityAction'

const initialState = {
    allActivity: {}, //所有貼文
}
export const activityReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_ACTIVITY_DATA:
            return {
                ...state,
                allActivity: action.activityData
            }
        default:
            return state
    }
}