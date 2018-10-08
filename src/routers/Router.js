import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import AuthRouter from './AuthRouter'
import HomeRouter from './HomeRouter'
import ClubRouter from './ClubRouter'
import PersonalRouter from './PersonalRouter'
import FirstLoginRouter from './FirstLoginRouter'
import UserRouter from './UserRouter'
import SearchRouter from './SearchRouter'
import AnalysisRouter from './AnalysisRouter'

//第三層
const MainRouter = createBottomTabNavigator({
    HomeRouter: HomeRouter,
    SearchRouter: SearchRouter,
    ClubRouter: ClubRouter,
    AnalysisRouter: AnalysisRouter,
    PersonalRouter: PersonalRouter,
},
{
    navigationOptions: ({navigation}) => {
        const { index, routes } = navigation.state
        return {
            tabBarVisible: !(routes[index].routeName == 'AddPost'),
            animationEnabled: true,
            swipeEnabled: true
        }
    }
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

