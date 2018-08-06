import { createSwitchNavigator } from 'react-navigation'
import LoginPage from '../containers/auth/LoginPage'
import RegisteredPage from '../containers/auth/RegisteredPage'
import ForgotEmailPage from '../containers/auth/ForgotEmailPage'
import SendEamilResultPage from '../containers/auth/SendEamilResultPage'
import requireAuthFlow from '../containers/flowControll/requireAuthFlow'



export default createSwitchNavigator({

  Login: {
    screen: requireAuthFlow(LoginPage)
  },

  Register: {
    screen: requireAuthFlow(RegisteredPage)
  },

  ForgotEmail: {
    screen: requireAuthFlow(ForgotEmailPage)
  },

  SendEamilResult: {
    screen: requireAuthFlow(SendEamilResultPage)
  },

})