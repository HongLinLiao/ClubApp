import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import AuthRouter from './AuthRouter'
import HomeStack from './HomeRouter'
import * as firebase from "firebase"


const AppRouter = createBottomTabNavigator({
    HomeStack: HomeStack
})


const createRootRouter = (signedIn) => {
    return createSwitchNavigator({
        App: AppRouter,
        Auth: AuthRouter
    },
    {
        initialRouteName: signedIn ? 'App' : 'Auth'
    })
}

export default createRootRouter

