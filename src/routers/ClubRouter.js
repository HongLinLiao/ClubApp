import { createStackNavigator } from 'react-navigation'
import ClubPage from '../containers/club/ClubPage'
import AddPostPage from '../containers/club/AddPostPage'

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

      const { createPost } = navigation.state.params
      return {
        headerRight: <Button title='發送' onPress={() => createPost()}/>
      }
    }
  }
})