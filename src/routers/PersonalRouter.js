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
//import PersonalStyles from '../styles/home/Home'
import requireAppFlow from '../containers/flowControll/requireAppFlow'


import React from 'react'
import { Button, TouchableOpacity,Image } from 'react-native'


const ClubManagePage = createMaterialTopTabNavigator({
  JoinedClub: {
    screen:JoinedClubPage,
    navigationOptions: ({ navigation }) => ({
      title: '已加入',
      tabBarOptions: {
        style: {
          backgroundColor: '#0d4273'
        },
        indicatorStyle:{
          backgroundColor: '#f6b456'
        }
      }
    })
  },
  FavoriteClub: {
    screen:JoinedClubPage,
    navigationOptions: ({ navigation }) => ({
      title: '已收藏',
      tabBarOptions: {
        style: {
          backgroundColor: '#0d4273',
        },
        indicatorStyle:{
          backgroundColor: '#f6b456'
        }
      }
    })
  },
})
    



export default createStackNavigator({
  Profile: {
    screen: ProfilePage,
    navigationOptions: ({ navigation }) => ({
			title: '個人管理',
      headerBackTitle:'個人管理',
      headerBackImage:{
        tintColor: '#0d4273',
      },
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
    screen: ProfileSettingPage,
    navigationOptions: ({ navigation }) => ({
      title: '編輯個人',
      headerBackTitle: '上一頁',
      headerTitleStyle: {
        color: '#666666',
        fontSize: 20,
  },
      headerStyle: {
        backgroundColor: '#f6b456'
      },
      //headerLeft:(
          //<TouchableOpacity>
            //<Image source={require('../images/images2/arrowLeftBlue.png')} 
            //style={PersonalStyles.arrowLeftBlueImage}/>
          //</TouchableOpacity>
      //)
    }
    )
  },
  AdvancedSetting: {
    screen: AdvancedSettingPage,
    navigationOptions: ({ navigation }) => ({
      title: '進階管理',
      headerBackTitle: '上一頁',
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
  EmailReVerified: {
    screen: EmailReVerifiedPage,
  },
  SendEmailSuccessful: {
    screen: SendEmailSuccessfulPage,
  },
  ChangeEamil: {
    screen: ChangeEamilPage,
    navigationOptions: ({ navigation }) => ({
      title: '變更電子信箱',
      headerBackTitle: '上一頁',
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
  ChangePassword: {
    screen: ChangePasswordPage,
    navigationOptions: ({ navigation }) => ({
      title: '變更密碼',
      headerBackTitle: '上一頁',
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
  Notification: {
    screen: NotificationPage,
    navigationOptions: ({ navigation }) => ({
      title: '通知設定',
      headerBackTitle: '上一頁',
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
  ClubPrivateSetting: {
    screen: ClubPrivateSettingPage,
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: '上一頁',
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
  CreateClub: {
    screen: CreateClubPage,
    navigationOptions: ({ navigation }) => ({
      title: '創建社團',
      headerBackTitle: '上一頁',
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
  ClubManage: {
    screen: ClubManagePage,
    navigationOptions: ({ navigation }) => {
      console.log(navigation)
      // console.log(navigation.state.routes)
      return {
        headerRight: <Button title='創建社團' onPress={() => navigation.push('CreateClub')} />,
        title: '社團管理',
        headerTitleStyle: {
          color: '#666666',
          fontSize: 20,
        },
        headerStyle: {
          backgroundColor: '#f6b456'
        },
      }
    }
  }
},
{
  navigationOptions: {
    headerBackTitleStyle:{
      color: '#0d4273',
      fontSize: 15,
    },
    //headerBackImage: (
      //<TouchableOpacity>
        //<Image source={require('../images/images2/arrowLeftBlue.png')} />
      //</TouchableOpacity>
    //)
  }
})