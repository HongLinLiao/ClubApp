import { GET_POST_DATA } from '../actions/PostAction'

const initialState = {
  allPost:{} , //所有貼文
}

export const postReducer = (state = initialState, action) => {
  switch(action.type) {

    case GET_POST_DATA:
      return {
        ...state,
        allPost: action.postData
      }
    default:
      return state
  }
}