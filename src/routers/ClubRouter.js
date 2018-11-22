import { createStackNavigator } from 'react-navigation'
import ClubPage from '../containers/club/ClubPage'
import PostPage from '../containers/club/PostPage'
import AddPostPage from '../containers/club/AddPostPage'
import ActivityPage from '../containers/club/ActivityPage'
import AddActivityPage from '../containers/club/AddActivityPage'
import ClubAdminPage from '../containers/club/ClubAdminPage'
import ClubMemberPage from '../containers/club/ClubMemberPage'
import SearchPlacePage from '../containers/club/SearchPlacePage'
import MemberManagePage from '../containers/club/MemberManagePage'

import React from 'react'
import { Button, TouchableOpacity, Image, Text } from 'react-native'


export default createStackNavigator({
  Club: {
    screen: ClubPage,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
      headerBackTitle: '返回',
    }
  },

  Activity: {
    screen: ActivityPage,
    navigationOptions: ({ navigation }) => ({
			headerTitleStyle: {
				color: '#666666',
				fontSize: 18,
				fontFamily: 'Courier',
			},
			headerStyle: {
				backgroundColor: '#f6b456'
      },
      headerBackImage: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      ),
		})
  },

  Post: {
    screen: PostPage,
    navigationOptions: ({ navigation }) => ({
			headerTitleStyle: {
				color: '#666666',
				fontSize: 25,
				fontFamily: 'Courier',
			},
			headerStyle: {
				backgroundColor: '#f6b456'
      },
      headerBackImage: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      ),
		})
  },

  AddPost: {
    screen: AddPostPage,
    navigationOptions: ({ navigation }) => {
      const { askCreate } = navigation.state.params
      return {
        headerRight: (
          <TouchableOpacity onPress={() => askCreate()}>
            <Text style={{ fontSize: 18, color: '#0d4273', marginRight: 15 }}>發佈</Text>
          </TouchableOpacity>
        ),
        headerBackImage: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../images/images2/arrowLeftBlue.png')}
              style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        ),
        title: '新增文章',
        headerBackTitle: '社團',
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
        headerRight: (<TouchableOpacity onPress={() => askCreate()} >
          <Text style={{ fontSize: 18, color: '#0d4273', marginRight: 15 }}>建立活動</Text>
        </TouchableOpacity>
        ),
        headerBackImage: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
    navigationOptions: ({ navigation }) => ({
      headerBackImage: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      ),
      title: '管理者模式',
      headerTitleStyle: {
        color: '#666666',
        fontSize: 20,
      },
      headerStyle: {
        backgroundColor: '#f6b456'
      }
    })
  },
  ClubMember: {
    screen: ClubMemberPage,
    navigationOptions: ({ navigation }) => ({
      headerBackImage: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      ),
      title: '成員',
      headerTitleStyle: {
        color: '#666666',
        fontSize: 20,
      },
      headerStyle: {
        backgroundColor: '#f6b456'
      }
    })
  },
  MemberManage: {
    screen: MemberManagePage,
    navigationOptions: ({ navigation }) => ({
      headerBackImage: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      ),
      title: '更改職位',
      headerTitleStyle: {
        color: '#666666',
        fontSize: 20,
      },
      headerStyle: {
        backgroundColor: '#f6b456'
      }
    })
  },
  SearchPlace: {
    screen: SearchPlacePage,
    navigationOptions: ({ navigation }) => ({
      headerBackImage: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: '#666666',
        fontSize: 20,
      },
      headerStyle: {
        backgroundColor: '#f6b456'
      }
    })
  }
},
  {
    navigationOptions: {
      headerBackTitleStyle: {
        color: '#0d4273',
        fontSize: 15,
      },
    }
  })

