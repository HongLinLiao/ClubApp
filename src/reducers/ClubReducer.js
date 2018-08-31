import {
  SET_ALL_CLUB_DATA
} from '../actions/ClubAction'

const initialState = {
  clubs: {}, //所有使用者加入或收藏的社團資料
}

export const clubReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_ALL_CLUB_DATA:
      return {
        ...state,
        clubs: action.clubData
      } 

    default:
      return state
  }
}