import {
  SET_LOADING_STATE
} from '../actions/CommonAction'

const initialState = {
  loading: true
}

export const commonReducer = (state = initialState, action) => {
  switch(action.type) {
    
    //載入
    case SET_LOADING_STATE:
      return {
        ...state,
        loading: action.IsLoading
      }

    default:
      return state
  }
}