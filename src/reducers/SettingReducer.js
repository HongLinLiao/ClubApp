import {
  SIGN_IN_SUCCESS,
  SIGN_UP_SUCCESS,
  SIGN_WITH_FACEBOOK_SUCCESS,
  SIGN_WITH_GOOGLE_SUCCESS
} from '../actions/AuthAction'

import {
  UPDATE_USER_STATE_SUCCESS,
  CLEAR_USER_STATE,
} from '../actions/UserAction'

import {
  SET_GLOBAL_NOTIFICATION,
  SET_NIGHT_MODE_NOTIFICATION,
  SET_NIGHT_MODE_TIME,
  SET_CLUB_NOTIFICATION,
  SET_ALL_SETTING
} from '../actions/SettingAction'

import {
  CREATE_CLUB_SUCCESS,
  CREATE_CLUB_FAILURE,
  REMOVE_THE_CLUB,
  ADD_THE_CLUB,
} from '../actions/ClubAction'


const initialState = {
  message: '',
  globalNotification: true, //全域通知
  nightModeNotification: false, //夜間通知模式
  clubNotificationList: {}, //所有社團通知設定
  nightModeStart: null,
  nightModeEnd: null,
}

export const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_SETTING:
      return {
        ...state,
        globalNotification: action.globalNotification,
        nightModeNotification: action.nightModeNotification,
        clubNotificationList: action.clubNotificationList,
        nightModeEnd: action.nightModeEnd,
        nightModeStart: action.nightModeStart
      }
    case SET_GLOBAL_NOTIFICATION:
      return {
        ...state,
        globalNotification: action.on
      }
    case SET_NIGHT_MODE_NOTIFICATION:
      return {
        ...state,
        nightModeStart: action.start,
        nightModeEnd: action.end,
      }
    case SET_NIGHT_MODE_TIME:
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
        clubNotificationList: action.settingData
      }
    case ADD_THE_CLUB:
      return {
        ...state,
        clubNotificationList: action.settingData
      }
    case CLEAR_USER_STATE:
      return initialState
    default:
      return state
  }
}