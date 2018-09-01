import {
  CREATE_CLUB_SUCCESS,
  CREATE_CLUB_FAILURE,
  SET_ALL_CLUB_DATA,
  REMOVE_THE_CLUB,
} from '../actions/ClubAction'

const initialState = {
  message: '',
  clubs: {}, //所有使用者加入或收藏的社團資料
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
    default:
      return state
  }
}