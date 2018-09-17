import { createStackNavigator } from 'react-navigation'
import ClubPage from '../containers/club/ClubPage'
import ActivitiesPage from '../containers/club/ActivitiesPage'


export default createStackNavigator({
  Activities: ActivitiesPage,
  Club: ClubPage,
  
},
{
  navigationOptions: {
    header: null,
    gesturesEnabled: false
  }
})