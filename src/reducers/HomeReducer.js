import {
    GET_HOME_CLUBLIST_SUCCESS,
    GET_HOME_CLUBLIST_FAILURE,
    GET_HOME_POSTLIST_SUCCESS,
    GET_HOME_POSTLIST_FAILURE,
    SET_HOME_CLUBLIST_STATUS_SUCCESS,
    SET_HOME_CLUBLIST_STATUS_FAILURE,
} from '../actions/HomeAction'

import {
    CLEAR_USER_STATE
} from '../actions/UserAction'

const initialState = {
    clubList: {},//社團列表（控制篩選bool
    postList: {},//貼文列

    activityList: {},//首頁活動動態
    activity: {},//內頁活動 

    
    numSelectingStatusTrue: null, //計算clubList中有幾個是true
    message: null,//錯誤訊息
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        //取得clubList For selecting
        case GET_HOME_CLUBLIST_SUCCESS:
            return {
                ...state,
                clubList: action.clubList,
                numSelectingStatusTrue: action.numSelectingStatusTrue
            }
        case GET_HOME_CLUBLIST_FAILURE:
            return {
                ...state,
                message: action.message
            }
        //取得首頁貼文列表
        case GET_HOME_POSTLIST_SUCCESS:
            return {
                ...state,
                postList: action.postList
            }
        case GET_HOME_POSTLIST_FAILURE:
            return {
                ...state,
                message: action.message
            }
        //首頁篩選頁面按鈕觸發
        case SET_HOME_CLUBLIST_STATUS_SUCCESS:
            return {
                ...state,
                clubList: action.clubList,
                numSelectingStatusTrue: action.numSelectingStatusTrue
            }
        case SET_HOME_CLUBLIST_STATUS_FAILURE:
            return {
                ...state,
                message: action.message
            }
        case CLEAR_USER_STATE:
            return initialState
        default:
            return state
    }
}