import { createStackNavigator } from 'react-navigation'
import HomePage from '../containers/home/HomePage'
import requireAuth from '../containers/requireAuth'

export default createStackNavigator({
  Home: requireAuth(HomePage)
})