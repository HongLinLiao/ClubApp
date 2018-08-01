import * as AuthAction from '../actions/AuthAction'
import * as firebase from "firebase"
import Expo from 'expo' 

export const signInWithEmail = (email, password, remember, navigation) => async (dispatch) => {

  dispatch(AuthAction.signInRequest(remember)) //登入要求
  try {
    const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
    dispatch(AuthAction.signInSuccess(credential.user)) //登入成功更新UserState
    navigation.navigate('App')

    console.log(firebase.auth().currentUser)

  } catch(error) {
    dispatch(AuthAction.signInFail(error.toString())) //登入失敗

    console.log(error.toString())
  }

}

export const signUpUser = (newUser) => async (dispatch) => {
  dispatch(AuthAction.signUpRequest()) //註冊要求

  try {
    const { email, password, nickName } = newUser
    //建立使用者完firebase會自動登入
    const credential = await firebase.auth().createUserWithEmailAndPassword(email, password)
    await credential.user.updateProfile({
      displayName: nickName
    })
    dispatch(AuthAction.signUpSuccess(credential.user)) //註冊成功並更新UserState


    console.log(firebase.auth().currentUser)

  } catch(error) {
    dispatch(AuthAction.signUpFail(error.toString()))

    console.log(error.toString())
  }

}

export const signInWithFacebook = () => async (dispatch) => {

  dispatch(AuthAction.signWithFacebookRequest()) //facebook登入要求

  try {
    const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('221789121856824', { permissions: ['email'] })

    if(type == 'success') {

      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      
      const {user} = await firebase.auth().signInAndRetrieveDataWithCredential(credential)
      
      dispatch(AuthAction.signWithFacebookSuccess(user)) //facebook登入並更新狀態

    }

  } catch(error) {

    dispatch(AuthAction.signWithFacebookFail(error.toString()))

    console.log(error.toString())
  }
}

export const signInWithGoogle = () => async (dispatch) => {
  
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
      dispatch(AuthAction.signWithGoogleSuccess(user)) //google登入並更新狀態

    } else {
      console.log(result.type)
    }
  } catch(error) {

    dispatch(AuthAction.signWithGoogleFail(error.toString()))

    console.log(error.toString())
  }

}

export const setNickName = (nickName) => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    await user.updateProfile({
      displayName: nickName
    })
    dispatch(AuthAction.updateUser(user)) //更新使用者狀態

  } catch(error) {
    dispatch(AuthAction.updateUserFail(error.toString())) 

    console.log(error.toString())
  }

}

export const sendVerifiedMail = () => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    await user.sendEmailVerification() //firebase發送驗證信
    dispatch(AuthAction.sendVerifiedEmailSuccess())

  } catch(error) {
    dispatch(AuthAction.sendVerifiedEmailFail(error.toString()))
    

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

export const reloadUser = () => async (dispatch) => {
  
  try {
    const user = firebase.auth().currentUser
    await user.reload() //重新載入使用者

    dispatch(AuthAction.updateUser(user)) //更新使用者狀態
    if(user.emailVerified) 
      dispatch(AuthAction.setEmailVerifiedStatus(true)) //更新驗證狀態

  } catch(error) {
    dispatch(AuthAction.updateUserFail(error.toString()))
  }
  
}

export const signOut = () => async (dispatch) => {

  try {
    await firebase.auth().signOut()
    dispatch(AuthAction.clearUser())

  } catch(error) {
    dispatch(AuthAction.signOutFail(error.toString()))

    console.log(error.toString())
  }
  
}

