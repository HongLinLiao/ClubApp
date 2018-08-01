import { createSwitchNavigator } from 'react-navigation'
import LoginPage from '../containers/auth/LoginPage'
import RegisteredPage from '../containers/auth/RegisteredPage'
import EmailVerifiedPage from '../containers/auth/EmailVerifiedPage'
import ForgotEmailPage from '../containers/auth/ForgotEmailPage'
import SendEamilResultPage from '../containers/auth/SendEamilResultPage'
import requireNotAuth from '../containers/requireNotAuth'
import requireAuth from '../containers/requireAuth'



export default createSwitchNavigator({

  Login: {
    screen: requireNotAuth(LoginPage)
  },

  Register: {
    screen: requireNotAuth(RegisteredPage)
  },

  EmailVerify: {
    screen: requireAuth(EmailVerifiedPage),
    navigationOptions: () =>({
      header: null,
      gesturesEnabled: false
    })
  },

  ForgotEmail: {
    screen: requireNotAuth(ForgotEmailPage)
  },

  SendEamilResult: {
    screen: requireNotAuth(SendEamilResultPage)
  }
})