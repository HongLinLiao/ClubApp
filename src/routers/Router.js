import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import AuthRouter from './AuthRouter'
import HomeStack from './HomeRouter'
import * as firebase from "firebase"


const AppRouter = createBottomTabNavigator({
    HomeStack: HomeStack
})


const createRootRouter = () => {
    return createSwitchNavigator({
        App: AppRouter,
        Auth: AuthRouter,
    },
    {
        initialRouteName: 'Auth'
    })
}

export default createRootRouter

