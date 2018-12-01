import * as UserAction from '../actions/UserAction'
import * as CommonAction from '../actions/CommonAction'
import * as ClubAction from '../actions/ClubAction'
import * as SettingAction from '../actions/SettingAction'
import * as firebase from "firebase"
import { selectPhoto } from './Common'
import { getAllClubData, filterOpenClub, randomCid } from './Club'
import { listenToAllClubs, listenToUser, listenToUserSetting } from './Listener'
import { registerForPushNotificationsAsync } from './App'

import {
  initHomeClubList,
  getHomePostKey
} from './Home'
import {
  getPostDataComplete
} from './Post'

/*
|-----------------------------------------------
|   使用者redux相關
|-----------------------------------------------
*/

//從database取得使用者資料並更新redux
export const getAllUserData = (user) => async (dispatch) => {

  try {
    const userRef = firebase.database().ref('users').child(user.uid)
    const settingRef = firebase.database().ref('userSettings').child(user.uid)

    const userShot = await userRef.once('value')
    const settingShot = await settingRef.once('value')

    let userData = {}
    let settingData = {}
    let clubsData = {}

    if (userShot.val()) { //不是第一次登入才進入

      //紀錄使用者token
      await registerForPushNotificationsAsync(user)
      
      //使用者基本資料
      userData = await getUserStateToRedux()

      //使用者設定資料
      if (settingShot.val()) { //有沒有使用者設定資料
        settingData = await getUserSettingToRedux()
      } else {
        settingData = await createUserSettingInDB()
      }

      //使用者相關社團資料
      clubsData = await getAllClubData()
      const _newLikeClubs = filterOpenClub(clubsData.newLikeClubs)
      const allClubCids = Object.keys(clubsData.newJoinClubs).concat(Object.keys(_newLikeClubs))
      const _randomCid = randomCid(allClubCids)
      console.log(clubsData)
      console.log(allClubCids)
      console.log(_randomCid)

      dispatch(SettingAction.setAllSetting(settingData))
      dispatch(ClubAction.setCurrentClub(_randomCid))
      dispatch(ClubAction.setAllClubData(clubsData))
      dispatch(UserAction.updateUserState(userData)) //最後更新user才觸發authFlow

      dispatch(listenToUser())
      dispatch(listenToUserSetting())
      // dispatch(listenToAllClubs())

      // dispatch(CommonAction.setClubListen(true))

    } else { //有使用者帳號但資料庫沒user資料
      dispatch(CommonAction.setLoadingState(false)) //沒有使用者停止等待畫面
    }

  } catch (error) {

    dispatch(UserAction.updateUserStateFail(error.toString()))
    console.log(error.toString())
    throw error
  }

}

//重新載入user並更新redux
export const reloadUser = () => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    await user.reload() //重新載入使用者

    dispatch(UserAction.updateUser({ ...user })) //更新使用者狀態


  } catch (error) {

    dispatch(UserAction.updateUserFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //停止等待狀態
  }

}

/*
|-----------------------------------------------
|   使用者database相關
|-----------------------------------------------
*/

//從database取得redux資料
export const getUserStateToRedux = async () => {

  try {
    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('users').child(user.uid)
    const userShot = await userRef.once('value')
    const { nickName, password, loginType, aboutMe, joinClub, likeClub, activities } = userShot.val()

    let userData = {
      user: { ...user },
      firstLogin: nickName ? false : true,
      password: password || '', //串接平台登入沒有密碼
      loginType: loginType || '', //必要
      aboutMe: aboutMe || '',
      joinClub: joinClub ? joinClub : {},
      likeClub: likeClub ? likeClub : {},
      activities: activities || {},
    }

    return userData

  } catch (error) {

    console.log(error.toString())
    throw error

  }

}

//從database取得使用者設定
export const getUserSettingToRedux = async () => {

  try {
    const user = firebase.auth().currentUser
    const settingRef = firebase.database().ref('userSettings').child(user.uid)
    const settingShot = await settingRef.once('value')
    const { globalNotification, nightModeNotification, clubNotificationList } = settingShot.val()

    let settingData = {
      globalNotification,
      nightModeNotification,
      clubNotificationList: clubNotificationList ? clubNotificationList : {},
    }

    return settingData

  } catch (e) {

    console.log(e.toString())
    throw e

  }
}

//把使用者資料寫入資料庫
export const setUserStateToDB = async (userState) => {

  try {
    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('users').child(user.uid)
    const userShot = await userRef.once('value')
    const DB_userState = userShot.val()

    if (userState.nickName)
      DB_userState = { ...DB_userState, nickName: userState.nickName }

    if (userState.password)
      DB_userState = { ...DB_userState, password: userState.password }

    if (userState.aboutMe)
      DB_userState = { ...DB_userState, aboutMe: userState.aboutMe }

    if (userState.photoUrl)
      DB_userState = { ...DB_userState, photoUrl: userState.photoUrl }

    await userRef.update(DB_userState)

  } catch (e) {

    console.log(e)

    throw e
  }

}

//新增一個user資料進database
export const createUserInDatabase = async (user, userInfo) => {

  try {
    const userRef = firebase.database().ref('users').child(user.uid)

    if(!user.photoURL) {
      await user.updateProfile({ photoURL: "https://firebasestorage.googleapis.com/v0/b/clubapp-f9473.appspot.com/o/common%2Fuser.png?alt=media&token=682c4814-bdef-418a-85d7-279c4c756a1e" })
    }

    //資料庫新增
    await userRef.set({
      eamil: user.email,
      password: userInfo.password,
      nickName: user.displayName,
      loginType: userInfo.loginType,
      photoUrl: user.photoURL,
      aboutMe: false,
      joinClub: false,
      likeClub: false,
      activities: false,
    })

    //userReducer新增
    let userData = {
      user: { ...user },
      firstLogin: true, //預設都是第一次登入
      password: userInfo.password,
      loginType: userInfo.loginType,
      joinClub: {},
      likeClub: {},
    }

    return userData

  } catch (e) {

    console.log(e)
    throw e
  }

}



export const createUserSettingInDB = async () => {

  try {
    const user = firebase.auth().currentUser
    const settingRef = firebase.database().ref('userSettings').child(user.uid)

    const joinClubShot = await firebase.database().ref('users/' + user.uid + '/joinClub').once('value')
    const likeClubShot = await firebase.database().ref('users/' + user.uid + '/likeClub').once('value')

    const joinClub = joinClubShot.val() ? joinClubShot.val() : {}
    const likeClub = likeClubShot.val() ? likeClubShot.val() : {}

    let clubNotificationList = {}

    Object.keys(joinClub).map((cid) => {
      clubNotificationList[cid] = { on: true }
    })

    let settingData = {
      globalNotification: true,
      nightModeNotification: false,
      clubNotificationList: clubNotificationList ? clubNotificationList : {}
    }

    await settingRef.set(settingData)

    return settingData

  } catch (e) {
    console.log(e)
    throw e
  }
}

/*
|-----------------------------------------------
|   使用者storage相關
|-----------------------------------------------
*/

//上傳個人照片進storage
export const uploadImageAsync = async (uri, user) => {

  const response = await fetch(uri);
  const blob = await response.blob(); //轉換照片格式為blob
  const ref = firebase.storage().ref().child('users/' + user.uid + '/photo')

  const snapshot = await ref.put(blob); //firebase規定使用blob格式上傳檔案

  phtotUrl = await snapshot.ref.getDownloadURL()

  return phtotUrl
}

/*
|-----------------------------------------------
|   使用者操作相關
|-----------------------------------------------
*/

//更換大頭貼
export const changePhoto = () => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('users/' + user.uid)
    const photoUrl = await selectPhoto() //選擇照片

    if (photoUrl) {
      uploadUrl = await uploadImageAsync(photoUrl, user)

      //更新使用者url
      await user.updateProfile({
        photoURL: uploadUrl
      })

      //修改資料庫
      await userRef.update({ photoUrl: uploadUrl })

      dispatch(UserAction.updateUser({ ...user }))

      return true
    } else return false

  } catch (error) {
    console.log(error.toString())
    throw e
  }

}

//更新使用者基本資料
export const updateUserProfile = (profile) => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    const { aboutMe } = getState().userReducer
    let userState = {}


    //更新photo
    const uploadUrl = await uploadImageAsync(profile.photoURL, user)
    await user.updateProfile({ photoURL: uploadUrl })
    userState = { ...userState, photoUrl: uploadUrl }

    //更新nickName
    if (user.displayName != profile.nickName)
      await user.updateProfile({ displayName: profile.nickName })
    userState = { ...userState, nickName: profile.nickName }

    //更新aboutMe
    if (aboutMe != profile.aboutMe)
      userState = { ...userState, aboutMe: profile.aboutMe }

    //寫入database
    await setUserStateToDB(userState)

    //更新redux
    dispatch(UserAction.updateUserProfile({ ...user }, profile))

  } catch (e) {

    dispatch(UserAction.updateUserProfileFail(e.toString()))
    console.log(e)

    throw e
  }
}

//設定暱稱
export const setNickName = (nickName) => async (dispatch) => {

  try {

    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('/users').child(user.uid).child('nickName')

    //更新 firebase user
    await user.updateProfile({
      displayName: nickName
    })

    //更新 database
    await userRef.set(nickName)

    //更新 redux state
    dispatch(UserAction.updateUser({ ...user }))

  } catch (error) {
    dispatch(UserAction.updateUserFail(error.toString()))

    console.log(error.toString())

    throw error
  }

}