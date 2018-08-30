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
  SET_CLUB_NOTIFICATION
} from '../actions/SettingAction'

import {
  CREATE_CLUB
} from '../actions/ClubAction'


const initialState = {
  globalNotification: true, //全域通知
  nightModeNotification: false, //夜間通知模式
  clubNotificationList: {} //所有社團通知設定
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
        clubNotificationList: action.userData.userSetting.clubNotificationList
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
      {
        const { cid, clubSetting } = action
        let clubList = {...state.clubNotificationList}
        clubList[cid] = clubSetting
        return {
          ...state,
          clubNotificationList: clubList
        }
      }
    case CREATE_CLUB:
      {
        const { clubName, schoolName, on, cid } = action.clubInfo
        let newClub = { clubName, schoolName, on }
        let clubList = {...state.clubNotificationList}
        clubList[cid] = newClub
        return {
          ...state,
          clubNotificationList: clubList
        }
      }
    default:
      return state
  }
}