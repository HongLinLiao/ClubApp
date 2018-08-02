import { createSwitchNavigator } from 'react-navigation'
import LoginPage from '../containers/auth/LoginPage'
import RegisteredPage from '../containers/auth/RegisteredPage'
import EmailVerifiedPage from '../containers/auth/EmailVerifiedPage'
import ForgotEmailPage from '../containers/auth/ForgotEmailPage'
import SendEamilResultPage from '../containers/auth/SendEamilResultPage'
import NickNamePage from '../containers/auth/NickNamePage'
import requireAuthFlow from '../containers/requireAuthFlow'
import requireUserFlow from '../containers/requireUserFlow'



export default createSwitchNavigator({

  Login: {
    screen: requireAuthFlow(LoginPage)
  },

  Register: {
    screen: requireAuthFlow(RegisteredPage)
  },

  EmailVerify: {
    screen: requireUserFlow(EmailVerifiedPage),
    navigationOptions: () =>({
      header: null,
      gesturesEnabled: false
    })
  },

  ForgotEmail: {
    screen: requireAuthFlow(ForgotEmailPage)
  },

  SendEamilResult: {
    screen: requireAuthFlow(SendEamilResultPage)
  },

  NickName: {
    screen: requireUserFlow(NickNamePage)
  }
})