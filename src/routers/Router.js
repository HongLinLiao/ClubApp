import { createStackNavigator, createTabNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import AuthRouter from './LoginRouter'


const AppRouter = createTabNavigator({
    //五個主要功能TAB
})


export default createSwitchNavigator({
    App: AppRouter,
    Auth: AuthRouter
})

