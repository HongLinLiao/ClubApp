import { createStackNavigator } from 'react-navigation'
import React from 'react'
import HomePage from '../containers/home/HomePage'
import PostPage from '../containers/club/PostPage'
import SelectingPage from '../containers/home/HomeSelectingPage'
import HomeActivitiesPage from '../containers/home/HomeActivitiesPage'
import ActivityPage from '../containers/club/ActivityPage'
import requireAppFlow from '../containers/flowControll/requireAppFlow'
import { Image, TouchableOpacity } from 'react-native'
import { View } from 'native-base';
import homeStyles from '../styles/home/Home'

export default createStackNavigator({
	//預設首頁
	Home: {
		screen: requireAppFlow(HomePage),
		navigationOptions: ({ navigation }) => ({
			title: 'iClubs',
			headerBackTitle:'首頁',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 30,
				fontFamily:'Courier',
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},
			headerRight: (
				<TouchableOpacity>
					<Image source={require('../images/images2/control.png')}
						style={homeStyles.controlImage} />
				</TouchableOpacity>
			)
		})
	},
	// 貼文內頁，從Club匯入
	Post: {
		screen: requireAppFlow(PostPage),
		navigationOptions: ({ navigation }) => ({
			title: 'Posttitle',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 25,
				fontFamily:'Courier',
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			}
		})
	},
	//篩選
	Selecting: {
		screen: requireAppFlow(SelectingPage),
		navigationOptions: ({ navigation }) => ({
			title: 'Selecting',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 25,
				fontFamily:'Courier',
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			}
		})
	},
	// 動態貼文列表
	Stories: {
		screen: requireAppFlow(HomeActivitiesPage),
		navigationOptions: ({ navigation }) => ({
			title: '社團故事',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 25,
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			}
		})
	},
	// 動態貼文內頁，從Club匯入
	Activity:{
	    screen: requireAppFlow(ActivityPage),
	},
})