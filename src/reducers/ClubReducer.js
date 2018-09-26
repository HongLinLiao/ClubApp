import {
  CREATE_CLUB_SUCCESS,
  CREATE_CLUB_FAILURE,
  SET_ALL_CLUB_DATA,
  REMOVE_THE_CLUB,
} from '../actions/ClubAction'

import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS
} from '../actions/PostAction'

const initialState = {
  message: '',
  status: null, //執行狀態
  clubs: {}, //所有使用者加入或收藏的社團資料
  postList: {},
  post: {},
  comment: {}
}

export const clubReducer = (state = initialState, action) => {
  switch(action.type) {
    case CREATE_CLUB_SUCCESS:
      return {
        ...state,
        clubs: action.clubData.newClubs
      }
    case CREATE_CLUB_FAILURE:
      return {
        ...state,
        message: action.message
      }
    case SET_ALL_CLUB_DATA:
      return {
        ...state,
        clubs: action.clubData
      }
    case REMOVE_THE_CLUB:
      return {
        ...state,
        clubs: action.clubData.newClubs
      }
    case CREATE_POST_REQUEST:
      return {
        ...state,
        status: true
      }
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        clubs: action.newClubs
      }
    default:
      return state
  }
}