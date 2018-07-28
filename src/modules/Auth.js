import * as firebase from "firebase"
import * as loginAction from '../actions/LoginAction'

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

export const signUpUser = async (newUser) => async (dispatch) => {
  dispatch(loginAction.signUpRequest())

  try {
    const credential = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
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

export const sendVerifyMail = async (email) => {

}

