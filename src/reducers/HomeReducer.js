import {
    SET_CLUB_LIST_SUCCESS,
    SET_CLUB_LIST_FAILURE,
    GET_POST_LIST_SUCCESS,
    GET_POST_LIST_FAILURE,
    PRESS_POST_SUCCESS,
    PRESS_POST_FAILURE,
    SET_CLUB_STATUS_REQUEST,
    SET_CLUB_STATUS_SUCCESS,
    SET_CLUB_STATUS_FAILURE
} from '../actions/HomeAction'

const initialState = {
    message: null,//錯誤訊息
    postList: [],//貼文列
    post: [],//首頁點擊的那篇貼文
    status: false,//執行狀態
    clubList: [],//社團列表（控制篩選bool
    numSelectingStatusTrue: null //計算clubList中有幾個是true
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        //取得user clubList
        case SET_CLUB_LIST_SUCCESS:
            return {
                ...state,
                clubList: action.clubList,
                numSelectingStatusTrue: action.numSelectingStatusTrue,
                status: true
            }
        case SET_CLUB_LIST_FAILURE:
            return {
                ...state,
                status: false,
                message: action.message
            }
        //取得貼文列
        case GET_POST_LIST_SUCCESS:
            return {
                ...state,
                postList: action.postList
            }
        case GET_POST_LIST_FAILURE:
            return {
                ...state,
                status: false,
                message: action.message
            }
        //選取貼文，進入內頁
        case PRESS_POST_SUCCESS:
            return {
                ...state,
                status: true,
                post: action.post
            }
        case PRESS_POST_FAILURE:
            return {
                ...state,
                status: false,
                message: action.message
            }
        //篩選頁面按鈕觸發
        case SET_CLUB_STATUS_SUCCESS:
            return {
                ...state,
                clubList: action.clubList,
                numSelectingStatusTrue: action.numSelectingStatusTrue
            }
        case SET_CLUB_STATUS_FAILURE:
            return {
                ...state,
                status: false,
                message: action.message
            }
        default:
            return state
    }
}