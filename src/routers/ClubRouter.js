import { createStackNavigator } from 'react-navigation'
import ClubPage from '../containers/club/ClubPage'


export default createStackNavigator({
  Club: ClubPage
},
{
  navigationOptions: {
    header: null,
    gesturesEnabled: false
  }
})