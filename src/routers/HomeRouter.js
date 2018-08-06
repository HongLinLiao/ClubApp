import { createStackNavigator } from 'react-navigation'
import HomePage from '../containers/home/HomePage'
import requireAppFlow from '../containers/flowControll/requireAppFlow'

export default createStackNavigator({
  Home: requireAppFlow(HomePage)
})