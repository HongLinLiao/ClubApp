import * as SettingAction from '../actions/SettingAction'
import * as firebase from 'firebase'

/*
|-----------------------------------------------
|   App功能設定
|-----------------------------------------------
*/

//通知設定
export const setGlobalNotification = (on) => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    const settingRef = firebase.database().ref('settings').child(user.uid)

    await settingRef.update({ globalNotification: on })
    dispatch(SettingAction.setGlobalNotification(on))
    

  } catch(e) { 
    console.log(e)
    throw e
  }
}

export const setNightModeNotification = (on) => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    const settingRef = firebase.database().ref('settings').child(user.uid)

    await settingRef.update({ nightModeNotification: on })
    dispatch(SettingAction.setNightModeNotification(on))

  } catch(e) {
    console.log(e)
    throw e
  }
}

export const setClubNotification = (cid, clubSetting) => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    const clubSettingRef = firebase.database().ref('settings/' + user.uid + '/clubNotificationList/' + cid)

    console.log(clubSetting)
    await clubSettingRef.update({ on: clubSetting.on})

    dispatch(SettingAction.setClubNotification(cid, clubSetting))

  } catch(e) {
    console.log(e)
    throw e
  }
}