import { createStackNavigator } from 'react-navigation'
import LoginPage from '../containers/auth/LoginPage'
import RegisteredPage from '../containers/auth/RegisteredPage'
import ForgotPasswordPage from '../containers/auth/ForgotPasswordPage'
import SendEamilResultPage from '../containers/auth/SendEamilResultPage'
import requireAuthFlow from '../containers/flowControll/requireAuthFlow'



export default createStackNavigator({

  Login: {
    screen: requireAuthFlow(LoginPage)
  },

  Register: {
    screen: requireAuthFlow(RegisteredPage)
  },

  ForgotEmail: {
    screen: requireAuthFlow(ForgotPasswordPage)
  },

  SendEamilResult: {
    screen: requireAuthFlow(SendEamilResultPage)
  },

},
{
  navigationOptions: {
    header: null,
    gesturesEnabled: false
  }
})