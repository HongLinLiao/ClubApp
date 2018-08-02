import { createStackNavigator } from 'react-navigation'
import HomePage from '../containers/home/HomePage'
import requireAppFlow from '../containers/requireAppFlow'

export default createStackNavigator({
  Home: requireAppFlow(HomePage)
})