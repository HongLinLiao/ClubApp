import { createStackNavigator } from 'react-navigation'
import ProfilePage from '../containers/personal/ProfilePage'
import ProfileSettingPage from '../containers/personal/ProfileSettingPage'

export default createStackNavigator({
  Profile: ProfilePage,
  ProfileSetting: ProfileSettingPage
})