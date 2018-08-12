import * as AuthAction from '../actions/AuthAction'
import * as CommonAction from '../actions/CommonAction'
import * as firebase from "firebase"
import Expo from 'expo' 
import { Alert } from 'react-native'

const getUserState = async (user) => {

  try {
    let userState = {
      user: null,
      firstLogin: true
    }
    let userRef = firebase.database().ref('/users').child(user.uid)
    const snapShot = await userRef.once('value')

    if(snapShot.val()) { //使用者存在   
      userState.firstLogin = false
    }
    else {
      await userRef.set({email: user.email})
    }

    userState.user = {...user}

    return userState
    
  } catch(error) {

    console.log(error.toString())

  }

}

const signInSuccess = (action, user) => async (dispatch) => {

  const userState = await getUserState(user)

  dispatch(action(userState)) 
}

export const signInWithEmail = (email, password, remember) => async (dispatch) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  dispatch(AuthAction.signInRequest(remember)) //登入要求
  
  try {
    
    const {user} = await firebase.auth().signInWithEmailAndPassword(email, password);
    
    dispatch(signInSuccess(AuthAction.signInSuccess, user)) //登入成功

    
  } catch(error) {

    dispatch(AuthAction.signInFail(error.toString())) //登入失敗

    dispatch(CommonAction.setLoadingState(false))

    Alert.alert('登入失敗')

    console.log(error.toString())
  }

}

export const signUpUser = (newUser) => async (dispatch) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  dispatch(AuthAction.signUpRequest()) //註冊要求

  try {
    const { email, password } = newUser
    //建立使用者完firebase會自動登入
    const {user} = await firebase.auth().createUserWithEmailAndPassword(email, password)

    dispatch(signInSuccess(AuthAction.signUpSuccess, user)) //註冊成功並更新UserState

    Alert.alert('註冊成功(自動幫您登入)')


  } catch(error) {
    dispatch(AuthAction.signUpFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //取消等待狀態

    Alert.alert('註冊失敗')

    console.log(error.toString())
  }

}

export const signInWithFacebook = () => async (dispatch) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  dispatch(AuthAction.signWithFacebookRequest()) //facebook登入要求

  try {
    const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('221789121856824', { permissions: ['email'] })

    if(type == 'success') {

      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      const {user} = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      dispatch(signInSuccess(AuthAction.signWithFacebookSuccess, user)) //facebook登入並更新狀態

    }
    else {
      dispatch(CommonAction.setLoadingState(false)) //結束等待狀態
    }


  } catch(error) {

    dispatch(AuthAction.signWithFacebookFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //結束等待狀態

    Alert.alert('Facebook登入失敗')

    console.log(error.toString())

  }
}

export const signInWithGoogle = () => async (dispatch) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態
  
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

      dispatch(signInSuccess(AuthAction.signWithGoogleSuccess, user)) //google登入並更新狀態

    } else {
      dispatch(CommonAction.setLoadingState(false)) //取消等待狀態
    }
    
  } catch(error) {

    dispatch(AuthAction.signWithGoogleFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //取消等待狀態

    Alert.alert('Google登入失敗')

    console.log(error.toString())
  }

}

export const setNickName = (nickName) => async (dispatch) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {
    const user = firebase.auth().currentUser
    await user.updateProfile({
      displayName: nickName
    })
    dispatch(AuthAction.updateUser({...user})) //更新使用者狀態

  } catch(error) {
    dispatch(AuthAction.updateUserFail(error.toString())) 

    dispatch(CommonAction.setLoadingState(false)) //取消登帶狀態

    console.log(error.toString())
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

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {
    
    await dispatch(reloadUser()) //更新使用者

    const { user } = getState().authReducer

    if(user.emailVerified) {

      Alert.alert('驗證成功')

    } else {

      dispatch(CommonAction.setLoadingState(false)) //取消登帶狀態
      Alert.alert('驗證失敗')

    }

  } catch(error) {

    console.log(error.toString())
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

export const updateUserState = (user) => async (dispatch) => {

    try {

      dispatch(signInSuccess(AuthAction.updateUserState, user))

    } catch(error) {

      dispatch(AuthAction.updateUserFail(error.toString()))

    }

}

export const reloadUser = () => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    await user.reload() //重新載入使用者

    dispatch(AuthAction.updateUser({...user})) //更新使用者狀態
    

  } catch(error) {

    dispatch(AuthAction.updateUserFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //開始載入
  }
  
}

export const signOut = () => async (dispatch) => {

  dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {
    await firebase.auth().signOut()
    dispatch(AuthAction.clearUser())

    setTimeout(
      () => dispatch(CommonAction.setLoadingState(false)), //進入等待狀態
      1000
    )
    

  } catch(error) {
    dispatch(AuthAction.signOutFail(error.toString()))

    console.log(error.toString())
  }
  
}

