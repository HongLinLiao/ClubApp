import {
  SIGN_IN_SUCCESS,
  SIGN_UP_SUCCESS,
  SIGN_WITH_FACEBOOK_SUCCESS,
  SIGN_WITH_GOOGLE_SUCCESS
} from '../actions/AuthAction'

import {
  UPDATE_USER_STATE_SUCCESS
} from '../actions/UserAction'


const initialState = {
  globalNotification: true,
  nightModeNotification: false,
  clubNotification: []
}

export const settingReducer = (state = initialState, action) => {
  switch(action.type) {
    case SIGN_IN_SUCCESS:
    case SIGN_UP_SUCCESS:
    case SIGN_WITH_FACEBOOK_SUCCESS:
    case SIGN_WITH_GOOGLE_SUCCESS:
    case UPDATE_USER_STATE_SUCCESS:
      return {
        ...state,
        globalNotification: action.userData.userSetting.globalNotification,
        nightModeNotification: action.userData.userSetting.nightModeNotification,
        clubNotification: action.userData.userSetting.clubNotification
      }
    default:
      return state
  }
}