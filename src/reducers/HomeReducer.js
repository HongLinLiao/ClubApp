import {
    GET_HOME_CLUBLIST_SUCCESS,
    GET_HOME_CLUBLIST_FAILURE,
    GET_HOME_POSTLIST_SUCCESS,
    GET_HOME_POSTLIST_FAILURE,
    SET_HOME_CLUBLIST_STATUS_SUCCESS,
    SET_HOME_CLUBLIST_STATUS_FAILURE,
    GET_HOME_INSIDE_POST_SUCCESS,
    GET_HOME_INSIDE_POST_FAILURE
} from '../actions/HomeAction'
import {
    SET_POST_FAVORITE_SUCCESS,
    SET_POST_FAVORITE_FAILURE,
    SET_POST_VIEW_SUCCESS,
    SET_POST_VIEW_FAILURE
} from '../actions/PostAction'

const initialState = {
    message: null,//錯誤訊息
    postList: {},//貼文列
    post: {},//內頁貼文
    status: false,//執行狀態
    clubList: {},//社團列表（控制篩選bool
    numSelectingStatusTrue: null //計算clubList中有幾個是true
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        //取得clubList For selecting
        case GET_HOME_CLUBLIST_SUCCESS:
            return {
                ...state,
                clubList: action.clubList,
                numSelectingStatusTrue: action.numSelectingStatusTrue,
                status: true
            }
        case GET_HOME_CLUBLIST_FAILURE:
            return {
                ...state,
                status: false,
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
                status: false,
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
                status: false,
                message: action.message
            }
        //加入或刪除貼文讚列
        case SET_POST_FAVORITE_SUCCESS:
            return {
                ...state,
                post: action.post
            }
        case SET_POST_FAVORITE_FAILURE:
            return {
                ...state,
                status: false,
                message: action.message
            }
        //加入觀看
        case SET_POST_VIEW_SUCCESS:
            return {
                ...state,
                postList: action.postList
            }
        case SET_POST_VIEW_FAILURE:
            return {
                ...state,
                status: false,
                message: action.message
            }
        //進入貼文內頁
        case GET_HOME_INSIDE_POST_SUCCESS:
            return {
                ...state,
                post: action.post
            }
        case GET_HOME_INSIDE_POST_FAILURE:
            return {
                ...state,
                status: false,
                message: action.message
            }
        default:
            return state
    }
}