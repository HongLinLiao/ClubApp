import { createStackNavigator } from 'react-navigation'
import ClubPage from '../containers/club/ClubPage'
import PostPage from '../containers/club/PostPage'
import AddPostPage from '../containers/club/AddPostPage'
import ActivityPage from '../containers/club/ActivityPage'
import AddActivityPage from '../containers/club/AddActivityPage'
import ClubAdminPage from '../containers/club/ClubAdminPage'
import ClubMemberPage from '../containers/club/ClubMemberPage'

import React from 'react'
import { Button } from 'react-native'


export default createStackNavigator({
  Club: {
    screen: ClubPage,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
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
        headerRight: <Button title='新增貼文' onPress={() => askCreate()} />
      }
    }
  },
  AddActivity: {
    screen: AddActivityPage,
    navigationOptions: ({ navigation }) => {

      const { askCreate } = navigation.state.params
      return {
        headerRight: <Button title='建立活動' onPress={() => askCreate()} />
      }
    }
  },
  
  ClubAdmin: {
    screen: ClubAdminPage,
  },

  ClubMember: {
    screen: ClubMemberPage,
  }
})