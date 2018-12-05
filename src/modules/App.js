import * as SettingAction from '../actions/SettingAction'
import { Permissions, Notifications } from 'expo'
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
    const settingRef = firebase.database().ref('userSettings').child(user.uid)

    await settingRef.update({ globalNotification: on })
    // dispatch(SettingAction.setGlobalNotification(on))
    

  } catch(e) { 
    console.log(e)
    throw e
  }
}

export const setNightModeNotification = (on) => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    const settingRef = firebase.database().ref('userSettings').child(user.uid)

    await settingRef.update({ nightModeNotification: on })
    // dispatch(SettingAction.setNightModeNotification(on))

  } catch(e) {
    console.log(e)
    throw e
  }
}

export const setClubNotification = (cid, clubSetting) => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    const clubSettingRef = firebase.database().ref('userSettings/' + user.uid + '/clubNotificationList/' + cid)
    let newClubNotificationList = {...getState().settingReducer.clubNotificationList}
    newClubNotificationList[cid] = clubSetting

    await clubSettingRef.update({ on: clubSetting.on})

    dispatch(SettingAction.setClubNotification(newClubNotificationList))

  } catch(e) {
    console.log(e)
    throw e
  }
}

//註冊推播權限
export const registerForPushNotificationsAsync = async (user) => {
  try {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    
    // console.log(user.uid)
    // console.log(token)

    // var partOfToken = token.substring(18, token.length-1)
    // Alert.alert('My token part is ', partOfToken)
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    await firebase.database().ref('users').child(user.uid).update({expoToken: token})

  } catch(e) {
    console.log(e.toString())
    throw e
  }
}


//紀錄使用者手機時區
export const recordUserTimeZone = async (user) => {
  const offset = new Date().getTimezoneOffset()
  await firebase.database().ref('users').child(user.uid).update({timezoneOffset: offset})
}