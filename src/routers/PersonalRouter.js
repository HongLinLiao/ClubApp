import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import ProfilePage from '../containers/personal/ProfilePage'
import ProfileSettingPage from '../containers/personal/ProfileSettingPage'
import AdvancedSettingPage from '../containers/personal/AdvancedSettingPage'
import EmailReVerifiedPage from '../containers/personal/EmailReVerifiedPage'
import SendEmailSuccessfulPage from '../containers/personal/SendEmailSuccessfulPage'
import ChangeEamilPage from '../containers/personal/ChangeEamilPage'
import ChangePasswordPage from '../containers/personal/ChangePasswordPage'
import NotificationPage from '../containers/personal/NotificationPage'
import CreateClubPage from '../containers/personal/CreateClubPage'
import ClubPrivateSettingPage from '../containers/personal/ClubPrivateSettingPage'
import JoinedClubPage from '../containers/personal/JoinedClubPage'
import FavoriteClubPage from '../containers/personal/FavoriteClubPage'
import requireAppFlow from '../containers/flowControll/requireAppFlow'

import React from 'react'
import { Button } from 'react-native'


const ClubManagePage = createMaterialTopTabNavigator({
  JoinedClub: JoinedClubPage,
  FavoriteClub: FavoriteClubPage,
})


export default createStackNavigator({
  Profile:{
    screen: requireAppFlow(ProfilePage),
    navigationOptions: ({ navigation }) => ({
			title: '個人管理',
			headerBackTitle:'上一頁',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 20,
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},
		}
		)
  },
  ProfileSetting: {
    screen:requireAppFlow(ProfileSettingPage),
  },
  AdvancedSetting: {
    screen:requireAppFlow(AdvancedSettingPage),
  },
  EmailReVerified: {
    screen:requireAppFlow(EmailReVerifiedPage),
  },
  SendEmailSuccessful: {
    screen:requireAppFlow(SendEmailSuccessfulPage),
  },
  ChangeEamil: {
    screen:requireAppFlow(ChangeEamilPage),
  },
  ChangePassword: {
    screen:requireAppFlow(ChangePasswordPage),
  },
  Notification: {
    screen:requireAppFlow(NotificationPage),
  },
  ClubPrivateSetting: {
    screen:requireAppFlow(ClubPrivateSettingPage),
  },
  CreateClub: {
    screen:requireAppFlow(CreateClubPage),
  },
  ClubManage: {
    screen: ClubManagePage,
    navigationOptions: ({ navigation }) => {
      console.log(navigation)
      // console.log(navigation.state.routes)
      return {
        headerRight: <Button title='創建社團' onPress={() => navigation.push('CreateClub')} />
      }
    }
  }
})