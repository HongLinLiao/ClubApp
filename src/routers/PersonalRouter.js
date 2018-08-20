import { createStackNavigator } from 'react-navigation'
import ProfilePage from '../containers/personal/ProfilePage'
import ProfileSettingPage from '../containers/personal/ProfileSettingPage'
import AdvancedSettingPage from '../containers/personal/AdvancedSettingPage'
import EmailReVerifiedPage from '../containers/personal/EmailReVerifiedPage'
import SendEmailSuccessfulPage from '../containers/personal/SendEmailSuccessfulPage'
import ChangeEamilPage from '../containers/personal/ChangeEamilPage'
import ChangePasswordPage from '../containers/personal/ChangePasswordPage'

export default createStackNavigator({
  Profile: ProfilePage,
  ProfileSetting: ProfileSettingPage,
  AdvancedSetting: AdvancedSettingPage,
  EmailReVerified: EmailReVerifiedPage,
  SendEmailSuccessful: SendEmailSuccessfulPage,
  ChangeEamil: ChangeEamilPage,
  ChangePassword: ChangePasswordPage
})