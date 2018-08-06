import { StackNavigator, createStackNavigator } from 'react-navigation'
import NickNamePage from '../containers/auth/NickNamePage'
import requireFirstFlow from '../containers/flowControll/requireFirstFlow'


export default FirstLoginRouter = createStackNavigator({
  NickName: requireFirstFlow(NickNamePage)
})