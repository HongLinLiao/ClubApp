import { createStackNavigator } from 'react-navigation'
import ClubPage from '../containers/club/ClubPage'
import PostPage from '../containers/club/PostPage'
import AddPostPage from '../containers/club/AddPostPage'
import ActivityPage from '../containers/club/ActivityPage'
import AddActivityPage from '../containers/club/AddActivityPage'
import ClubAdminPage from '../containers/club/ClubAdminPage'
import ClubMemberPage from '../containers/club/ClubMemberPage'

import React from 'react'
import { Button, TouchableOpacity, Image } from 'react-native'


export default createStackNavigator({
  Club: {
    screen: ClubPage,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
      headerBackTitle: '返回',
      headerBackTitleStyle: {
				color: '#0d4273',
				fontSize: 15,
			},
    },

    Activity: {
      screen: ActivityPage,
    },

    Post: {
      screen: PostPage
    },

    AddPost: {
      screen: AddPostPage,
      navigationOptions: ({ navigation }) => {
        const { askCreate } = navigation.state.params
        return {
          headerRight: <Button title='發佈' onPress={() => askCreate()} />,
          headerBackImage: (
            <TouchableOpacity>
              <Image source={require('../images/images2/arrowLeftBlue.png')}
                style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          ),
          title: '新增文章',
          headerTitleStyle: {
            color: '#666666',
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: '#f6b456'
          },
        }
      }
    },

    AddActivity: {
      screen: AddActivityPage,
      navigationOptions: ({ navigation }) => {

        const { askCreate } = navigation.state.params
        return {
          headerRight: <Button title='建立活動' onPress={() => askCreate()} />,
          headerBackImage: (
            <TouchableOpacity>
              <Image source={require('../images/images2/arrowLeftBlue.png')}
                style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          ),
          title: '新增活動',
          headerBackTitle: '社團',
          headerTitleStyle: {
            color: '#666666',
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: '#f6b456'
          }
        }
      }
    },

    ClubAdmin: {
      screen: ClubAdminPage,
    },

    ClubMember: {
      screen: ClubMemberPage,
      navigationOptions: ({ navigation }) => ({
        title: '編輯成員',
        headerTitleStyle: {
          color: '#666666',
          fontSize: 20,
        },
        headerStyle: {
          backgroundColor: '#f6b456'
        }
      })
    }
  }
})

