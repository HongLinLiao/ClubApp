import {
  GET_POSTLIST,
  GET_POST,
  GET_SETPOSTLIST,
  GET_SETPOST,
} from '../actions/PostAction'

import {
	CLEAR_USER_STATE
} from '../actions/UserAction'

const initialState = {
  postList: {},//每個tab貼文列
  post: {},//每個tab單篇貼文
  setPostList: {},//每個tab貼文列setState
  setPost: {},//每個tab貼文setState
}

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_POSTLIST:
      return {
        ...state,
        postList: action.postList
      }
    case GET_POST:
      return {
        ...state,
        post: action.post
      }
    case GET_SETPOSTLIST:
      return {
        ...state,
        setPostList: action.setPostList
      }
    case GET_SETPOST:
      return {
        ...state,
        setPost: action.setPost
      }
    case CLEAR_USER_STATE:
      return initialState
    default:
      return state
  }
}