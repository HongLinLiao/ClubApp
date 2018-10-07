import {
  CREATE_CLUB_SUCCESS,
  CREATE_CLUB_FAILURE,
  SET_ALL_CLUB_DATA,
  REMOVE_THE_CLUB,
  SET_CLUB_PHOTO,
  SET_CLUB_OPEN,
  SET_CURRENT_CLUB,
  ADD_THE_CLUB,
  DELETE_CLUB_MEMBER,
} from '../actions/ClubAction'

import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS
} from '../actions/PostAction'

import {
  CLEAR_USER_STATE
} from '../actions/UserAction'

const initialState = {
  message: '',
  currentCid: null,
  status: null, //執行狀態
  joinClubs: {}, //加入社團
  likeClubs: {}, //收藏社團
  postList: {},
}

export const clubReducer = (state = initialState, action) => {
  switch(action.type) {
    case CREATE_CLUB_SUCCESS:
      return {
        ...state,
        joinClubs: action.clubData.newClubs
      }
    case CREATE_CLUB_FAILURE:
      return {
        ...state,
        message: action.message
      }
    case SET_ALL_CLUB_DATA:
      return {
        ...state,
        joinClubs: action.clubData.newJoinClubs,
        likeClubs: action.clubData.newLikeClubs,
      }
    case ADD_THE_CLUB:
      return {
        ...state,
        joinClubs: action.clubData.newJoinClubs,
        likeClubs: action.clubData.newLikeClubs,
      }
    case REMOVE_THE_CLUB:
      return {
        ...state,
        joinClubs: action.clubData.newJoinClubs,
        likeClubs: action.clubData.newLikeClubs,
        currentCid: action.cid,
      }
    case CREATE_POST_REQUEST:
      return {
        ...state,
        status: true
      }
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        joinClubs: action.newClubs
      }
    case SET_CLUB_PHOTO:
      return {
        ...state,
        joinClubs: action.clubData
      }
    case SET_CLUB_OPEN:
      return {
        ...state,
        joinClubs: action.clubData
    }
    case SET_CURRENT_CLUB:
      return {
        ...state,
        currentCid: action.currentCid
      }
    case DELETE_CLUB_MEMBER:
      return {
        ...state,
        joinClubs: action.clubData
      }
    case CLEAR_USER_STATE:
      return initialState
    default:
      return state
  }
}