import { createStackNavigator } from 'react-navigation'
import LoginPage from '../containers/login/LoginPage'
import RegisteredPage from '../containers/login/RegisteredPage'
import EmailVerifiedPage from '../containers/login/EmailVerifiedPage'



export default createStackNavigator({
  LoginIn: LoginPage,
  Register: RegisteredPage,
  EmailVerified: EmailVerifiedPage
})