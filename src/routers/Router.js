import { createStackNavigator, createTabNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import AuthRouter from './AuthRouter'
import HomeStack from './HomeRouter'
import * as firebase from "firebase"


const AppRouter = createTabNavigator({
    HomeStack: HomeStack
})


export default createSwitchNavigator({
    App: AppRouter,
    Auth: AuthRouter
},
{
    initialRouteName: 'Auth'
})