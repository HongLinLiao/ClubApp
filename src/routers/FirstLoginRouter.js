import { StackNavigator, createStackNavigator } from 'react-navigation'
import NickNamePage from '../containers/introduction/NickNamePage'
import PhotoPage from '../containers/introduction/PhotoPage'
import requireFirstFlow from '../containers/flowControll/requireFirstFlow'

export default FirstLoginRouter = createStackNavigator({
  NickName: requireFirstFlow(NickNamePage),
  Photo: requireFirstFlow(PhotoPage)
},
{
  navigationOptions: {
    header: null,
    gesturesEnabled: true
  }
})