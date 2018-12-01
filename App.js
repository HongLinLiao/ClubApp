import React from 'react';
import { Permissions } from 'expo';
import * as firebase from "firebase";
import { rootReducer } from './src/reducers/Reducer'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import firebaseConfig from './src/firebaseConfig'
import { getAllUserData } from './src/modules/User'
import createRootRouter from './src/routers/Router'
import { Spinner } from './src/components/common/Spinner'
import { setLoadingState } from './src/actions/CommonAction'


export const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger))



export default class App extends React.Component {

  state = {
    loading: true
  }

  componentWillMount() {

    firebase.initializeApp(firebaseConfig)
    
    firebase.auth().onAuthStateChanged(async (user) => { //監聽起始點
      
      console.log('user is', user)

      if(this.state.loading) { //初次載入App

        if(user) {
          store.dispatch(getAllUserData(user))
        }
        else {
          store.dispatch(setLoadingState(false)) //停止等待畫面顯示login頁面
        }
        this.setState({ loading: false })

      }
      
    })

  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.LOCATION);
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }

  render() {
    const RootRouter = createRootRouter()
    return (
      <Provider store={store}>
        { !this.state.loading ? <RootRouter /> : <Spinner /> }
      </Provider>
    );
  }
}


