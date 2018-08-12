import { StackNavigator, createStackNavigator } from 'react-navigation'
import NickNamePage from '../containers/introduction/NickNamePage'
import requireFirstFlow from '../containers/flowControll/requireFirstFlow'


export default FirstLoginRouter = createStackNavigator({
  NickName: requireFirstFlow(NickNamePage)
},
{
  navigationOptions: {
    header: null,
    gesturesEnabled: true
  }
})