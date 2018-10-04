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

import React from 'react'
import { Button } from 'react-native'


const ClubManagePage = createMaterialTopTabNavigator({
  JoinedClub: JoinedClubPage,
  FavoriteClub: FavoriteClubPage,
})


export default createStackNavigator({
  Profile: ProfilePage,
  ProfileSetting: ProfileSettingPage,
  AdvancedSetting: AdvancedSettingPage,
  EmailReVerified: EmailReVerifiedPage,
  SendEmailSuccessful: SendEmailSuccessfulPage,
  ChangeEamil: ChangeEamilPage,
  ChangePassword: ChangePasswordPage,
  Notification: NotificationPage,
  ClubPrivateSetting: ClubPrivateSettingPage,
  CreateClub: CreateClubPage,
  ClubManage: {
    screen: ClubManagePage,
    navigationOptions: ({navigation}) => {
      console.log(navigation)
      // console.log(navigation.state.routes)
      return {
        headerRight: <Button title='創建社團' onPress={() => navigation.push('CreateClub')}/>
      }   
    }
  }
})