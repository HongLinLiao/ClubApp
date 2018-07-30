import { createStackNavigator } from 'react-navigation'
import LoginPage from '../containers/auth/LoginPage'
import RegisteredPage from '../containers/auth/RegisteredPage'
import EmailVerifiedPage from '../containers/auth/EmailVerifiedPage'
import requireNotAuth from '../containers/auth/requireNotAuth'



export default createStackNavigator({
  LoginIn: requireNotAuth(LoginPage),
  Register: RegisteredPage,
  EmailVerified: EmailVerifiedPage
})