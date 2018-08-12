import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import AuthRouter from './AuthRouter'
import HomeRouter from './HomeRouter'
import FirstLoginRouter from './FirstLoginRouter'
import UserRouter from './UserRouter'

//第三層
const MainRouter = createBottomTabNavigator({
    HomeRouter: HomeRouter
})

//第二層
const AppRouter = createSwitchNavigator({
    UserRouter: UserRouter,
    FirstLoginRouter: FirstLoginRouter,
    MainRouter: MainRouter,
})

//第一層
const createRootRouter = () => {
    return createSwitchNavigator({
        AuthRouter: AuthRouter,
        AppRouter: AppRouter,
    })
}

export default createRootRouter

