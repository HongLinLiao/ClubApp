import * as AuthAction from '../actions/AuthAction'
import * as CommonAction from '../actions/CommonAction'
import * as UserAction from '../actions/UserAction'
import * as ClubAction from '../actions/ClubAction'
import * as SettingAction from '../actions/SettingAction'
import * as firebase from "firebase"
import Expo from 'expo' 
import { Alert } from 'react-native'
import { 
  getUserStateToRedux,
  createUserInDatabase,
  reloadUser,
  setUserStateToDB,
  getUserSettingToRedux,
  createUserSettingInDB
} from './User'

import {
  getAllClubData
} from './Club'

import {
  getHomeClubList , 
  getHomePostList ,
  determinToSearch
} from './Home'

const signInSuccess = (action, user, password, loginType) => async (dispatch) => {

  try {
    const userRef = firebase.database().ref('users').child(user.uid)
    const settingRef = firebase.database().ref('userSettings').child(user.uid)

    const userShot = await userRef.once('value')
    const settingShot = await settingRef.once('value')

    const userInfo = { password, loginType }

    let userData = {}
    let settingData = {}
    let allClubData = {}

    //使用者基本資料
    if(userShot.val()) { //之前登入過 
      userData = await getUserStateToRedux()
    } else { //第一次登入
      userData = await createUserInDatabase(user, userInfo)
    }

    //使用者設定資料
    if(settingShot.val()) { //是否有使用者設定資料
      settingData = await getUserSettingToRedux() 
    } else {
      settingData = await createUserSettingInDB()
    }
    
    //使用者相關社團資料
    allClubData = await getAllClubData()

    //更新reducer
    dispatch(SettingAction.setAllSetting(settingData))
    dispatch(ClubAction.setAllClubData(allClubData))
    dispatch(action(userData)) //最後更新user才出發authFlow

    //直接在登入先抓首頁資料
    const homeClubList = await dispatch(getHomeClubList(userData.joinClub,userData.likeClub));
    const homePostList = await dispatch(getHomePostList(homeClubList));
  } catch(e) {

    console.log(e.toString())
    throw e
  }
  
}

export const signInWithEmail = (email, password, remember) => async (dispatch) => {

  dispatch(AuthAction.signInRequest(remember)) //登入要求
  
  try {
    
    const {user} = await firebase.auth().signInWithEmailAndPassword(email, password);
    
    dispatch(signInSuccess(AuthAction.signInSuccess, user, password, 'normal')) //登入成功

    
  } catch(error) {

    dispatch(AuthAction.signInFail(error.toString())) //登入失敗

    throw error

    console.log(error.toString())
  }

}

export const signUpUser = (newUser) => async (dispatch) => {

  dispatch(AuthAction.signUpRequest()) //註冊要求

  try {
    const { email, password } = newUser
    //建立使用者完firebase會自動登入
    const {user} = await firebase.auth().createUserWithEmailAndPassword(email, password)

    dispatch(signInSuccess(AuthAction.signUpSuccess, user, password, 'normal')) //註冊成功並更新UserState


  } catch(error) {
    dispatch(AuthAction.signUpFail(error.toString()))

    console.log(error.toString())

    throw error
  }

}

export const signInWithFacebook = () => async (dispatch) => {

  dispatch(AuthAction.signWithFacebookRequest()) //facebook登入要求

  try {
    const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('221789121856824', { permissions: ['email'] })

    if(type == 'success') {

      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      const {user} = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      dispatch(signInSuccess(AuthAction.signWithFacebookSuccess, user, null, 'Facebook')) //facebook登入並更新狀態

    }
    else {

      throw new Error('取消登入')
    }


  } catch(error) {

    dispatch(AuthAction.signWithFacebookFail(error.toString()))

    // dispatch(CommonAction.setLoadingState(false)) //結束等待狀態

    console.log(error.toString())

    throw error

  }
}

export const signInWithGoogle = () => async (dispatch) => {

  // dispatch(CommonAction.setLoadingState(true)) //進入等待狀態
  
  dispatch(AuthAction.signWithGoogleRequest()) //google登入要求

  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: "951052400924-slt3s3uvfngbobeun5p4q2v0rmnm90jb.apps.googleusercontent.com",
      iosClientId: "951052400924-73rm091duv4rkh15a9mrunlrm5j96rg2.apps.googleusercontent.com",
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {

      const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)
      const {user} = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      dispatch(signInSuccess(AuthAction.signWithGoogleSuccess, user, null, 'Google')) //google登入並更新狀態
    
    }
    
  } catch(error) {

    dispatch(AuthAction.signWithGoogleFail(error.toString()))

    console.log(error.toString())

    throw error
  }

}

export const sendVerifiedMail = () => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    await user.sendEmailVerification() //firebase發送驗證信
    dispatch(AuthAction.sendVerifiedEmailSuccess())

    Alert.alert("驗證信已發送！")

  } catch(error) {
    dispatch(AuthAction.sendVerifiedEmailFail(error.toString()))
    
    Alert.alert("驗證信已發送！")

    console.log(error.toString())
  }
  
}

export const emailVerified = () => async (dispatch, getState) => {

  // dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {
    
    await dispatch(reloadUser()) //更新使用者

    const { user } = getState().userReducer

    if(!user.emailVerified) {

      dispatch(CommonAction.setLoadingState(false)) //取消登帶狀態
      throw new Error('驗證失敗')

    }

  } catch(error) {

    console.log(error.toString())
    throw error
  }

}

export const changeEmail = (newEmail, password) => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, password)
    await user.reauthenticateAndRetrieveDataWithCredential(credential)

    await user.updateEmail(newEmail)

    dispatch(UserAction.updateUser({...user}))

  } catch(e) {
    console.log(e)
    throw e
  }
}

export const updateUserPassword = (oldPassword, newPassword) => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword)
    //重新驗證
    await user.reauthenticateAndRetrieveDataWithCredential(credential)
    //更新firebase user密碼
    await user.updatePassword(newPassword)
    //更新database user密碼
    await setUserStateToDB({ password: newPassword })
    // //更新redux user密碼
    dispatch(AuthAction.setUserPassword(newPassword))

  } catch(e) {
    console.log(e.toString())
    throw e
  }
}

export const sendResetMail = (email) => async (dispatch) => {

  try {
    await firebase.auth().sendPasswordResetEmail(email) //firebase寄發重設信
    dispatch(AuthAction.sendResetEmailSuccess())

  } catch(error) {
    dispatch(AuthAction.sendResetEmailFail(error.toString()))

    console.log(error.toString())
  }

}

export const signOut = () => async (dispatch) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {
    await firebase.auth().signOut()
    dispatch(UserAction.clearUser())

    setTimeout(
      () => dispatch(CommonAction.setLoadingState(false)), //進入等待狀態
      1000
    )
    

  } catch(error) {
    dispatch(AuthAction.signOutFail(error.toString()))

    console.log(error.toString())
  }
  
}

