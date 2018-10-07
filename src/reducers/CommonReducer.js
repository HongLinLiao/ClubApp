import {
  SET_LOADING_STATE,
  SET_CLUB_LISTEN,
} from '../actions/CommonAction'

const initialState = {
  loading: true,
  clubListen: false,
}

export const commonReducer = (state = initialState, action) => {
  switch(action.type) {
    
    //載入
    case SET_LOADING_STATE:
      return {
        ...state,
        loading: action.IsLoading
      }

    case SET_CLUB_LISTEN:
      return {
        ...state,
        clubListen: action.IsListen
      }

    default:
      return state
  }
}