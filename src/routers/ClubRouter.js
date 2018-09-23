import { createStackNavigator } from 'react-navigation'
import ClubPage from '../containers/club/ClubPage'
import AddPostPage from '../containers/club/AddPostPage'
import AddActivityPage from '../containers/club/AddActivityPage'
import ClubAdminPage from '../containers/club/ClubAdminPage'

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
  AddPost: {
    screen: AddPostPage,
    navigationOptions: ({navigation}) => {
      const { askCreate } = navigation.state.params
      return {
        headerRight: <Button title='新增貼文' onPress={() => askCreate()}/>
      }
    }
  },
  AddActivity: {
    screen: AddActivityPage,
    navigationOptions: ({navigation}) => {

      const { askCreate } = navigation.state.params
      return {
        headerRight: <Button title='建立活動' onPress={() => askCreate()}/>
      }
    }
  },
  ClubAdmin: {
    screen: ClubAdminPage,
  }
})