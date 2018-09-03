import {
  SIGN_IN_SUCCESS,
  SIGN_UP_SUCCESS,
  SIGN_WITH_FACEBOOK_SUCCESS,
  SIGN_WITH_GOOGLE_SUCCESS
} from '../actions/AuthAction'

import {
  UPDATE_USER_STATE_SUCCESS
} from '../actions/UserAction'

import {
  SET_GLOBAL_NOTIFICATION,
  SET_NIGHT_MODE_NOTIFICATION,
  SET_CLUB_NOTIFICATION,
  SET_ALL_SETTING
} from '../actions/SettingAction'

import {
  CREATE_CLUB_SUCCESS,
  CREATE_CLUB_FAILURE,
  REMOVE_THE_CLUB,
} from '../actions/ClubAction'


const initialState = {
  message: '',
  globalNotification: true, //全域通知
  nightModeNotification: false, //夜間通知模式
  clubNotificationList: { schoolName: '', clubName: '', on: ''} //所有社團通知設定
}

export const settingReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_ALL_SETTING:
      return {
        ...state,
        globalNotification: action.globalNotification,
        nightModeNotification: action.nightModeNotification,
        clubNotificationList: action.clubNotificationList
      }
    case SET_GLOBAL_NOTIFICATION:
      return {
        ...state,
        globalNotification: action.on
      }
    case SET_NIGHT_MODE_NOTIFICATION:
      return {
        ...state,
        nightModeNotification: action.on
      }
    case SET_CLUB_NOTIFICATION:
      return {
        ...state,
        clubNotificationList: action.newClubNotificationList
      }
    case CREATE_CLUB_SUCCESS:
      return {
        ...state,
        clubNotificationList: action.clubData.newClubNotificationList
      }
    case CREATE_CLUB_FAILURE:
      return {
        ...state,
        message: action.message
      }
    case REMOVE_THE_CLUB:
      return {
        ...state,
        clubNotificationList: action.clubData.newClubNotificationList
      }
    default:
      return state
  }
}