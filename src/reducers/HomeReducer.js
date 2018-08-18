import {
    GET_POST_LIST_REQUEST,
    GET_POST_LIST_SUCCESS,
    GET_POST_LIST_FAILURE,
    PRESS_POST_SUCCESS,
    PRESS_POST_FAILURE,
    SELECT_CLUB_REQUEST,
    SELECT_CLUB_SUCCESS,
    SELECT_CLUB_FAILURE
} from '../actions/HomeAction'

const initialState = {
    message: null,//錯誤訊息
    postList: [],//貼文列
    post: [],//首頁點擊的那篇貼文
    status: false,//執行狀態
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        //取得貼文列
        case GET_POST_LIST_REQUEST:
            return {
                ...state,
                status: true
            }
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
        case SELECT_CLUB_REQUEST:
            return {
                ...state,
                status: true,
            }
        case SELECT_CLUB_SUCCESS:
            return {
                ...state,
            }
        case SELECT_CLUB_FAILURE:
            return {
                ...state,
                status: false,
                message: action.message
            }
        default:
            return state
    }
}