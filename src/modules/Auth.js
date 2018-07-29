import * as loginAction from '../actions/UserAction'
import * as firebase from "firebase"
import { Alert } from 'react-native'


export const signInWithEmail = (email, password, remember) => async (dispatch) => {

  dispatch(loginAction.signInRequest(remember))
  try {
    const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
    dispatch(loginAction.signInSuccess(credential.user))
    console.log(firebase.auth().currentUser)

  } catch(error) {
    dispatch(loginAction.signInFail(error.toString()))
    console.log(error.toString())
  }

}

export const signUpUser = (newUser) => async (dispatch) => {
  dispatch(loginAction.signUpRequest())

  try {
    const credential = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    credential.user.updateProfile({
      displayName: newUser.nickName
    })
    dispatch(loginAction.signUpSuccess(credential.user))
    console.log(firebase.auth().currentUser)

  } catch(error) {
    dispatch(loginAction.signUpFail(error.toString()))
    console.log(error.toString())
  }

}

export const signInWithFacebook = async () => {

}

export const signInWithGoogle = async () => {

}

export const sendVerifiedMail = async () => {
  const user = firebase.auth().currentUser
  await user.sendEmailVerification()
}

export const signOut = () => async (dispatch) => {
  await firebase.auth().signOut()
  dispatch(loginAction.clearUser())
}

