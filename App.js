import React from 'react';
import Exop from 'expo';
import * as firebase from "firebase";
import { StyleSheet, Text, View } from 'react-native';
import createRootRouter from './src/routers/Router'
import { rootReducer } from './src/reducers/Reducer'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import firebaseConfig from './src/firebaseConfig'



const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger))


firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged((user) => {
  if(user) {
    console.log('firebase current user is', user)
  }
})

export default class App extends React.Component {

  state = {
    signedIn: false
  }

  componentDidMount() {
    if(firebase.auth().currentUser) {
      this.setState({signedIn: true})
    }
  }

  render() {
    const { signedIn } = this.state
    const RootRouter = createRootRouter(signedIn)
    return (
      <Provider store={store}>
        <RootRouter />
      </Provider>
    );
  }
}


