import { createStackNavigator } from 'react-navigation'
import React from 'react'
import HomePage from '../containers/home/HomePage'
import PostPage from '../containers/club/PostPage'
import SelectingPage from '../containers/home/HomeSelectingPage'
import HomeActivitiesPage from '../containers/home/HomeActivitiesPage'
import ActivityPage from '../containers/club/ActivityPage'
import requireAppFlow from '../containers/flowControll/requireAppFlow'
import { Image, TouchableOpacity, Text } from 'react-native'
import homeStyles from '../styles/home/Home'

export default createStackNavigator({

	//預設首頁
	Home: {
		screen: requireAppFlow(HomePage),
		navigationOptions: ({ navigation }) => ({
			title: 'iClubs',
			headerBackTitle: '首頁',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 30,
				fontFamily: 'Courier',
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},
			headerRight: (
				<TouchableOpacity onPress={() => {
					navigation.navigate("Selecting");
				}}>
					<Image source={require('../images/images2/control.png')}
						style={homeStyles.controlImage} />
				</TouchableOpacity>
			)
		})
	},
	// 貼文內頁，返回鍵用headerLeft覆蓋默認返回
	HomePost: {
		screen: requireAppFlow(PostPage),
		navigationOptions: ({ navigation }) => ({
			headerTitleStyle: {
				color: '#666666',
				fontSize: 25,
				fontFamily: 'Courier',
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},
			headerLeft: (
				<TouchableOpacity onPress={async () => {
					const syncPostBack = navigation.state.params.syncPostBack;
					const routeName = navigation.state.routeName;
					await syncPostBack(routeName);
					navigation.goBack();
				}}
					style={{ flexDirection: 'row' }}
				>
					<Image source={require('../images/images2/arrowLeftBlue.png')}
						style={{ width: 25, height: 25 }} />
				</TouchableOpacity>
			)
		})

	},
	//篩選
	Selecting: {
		screen: requireAppFlow(SelectingPage),
		navigationOptions: ({ navigation }) => ({
			title: '貼文篩選',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 20,
				fontFamily: 'Courier',
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
			title: '社團活動',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 20,
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			}
		})
	},
	// 動態貼文內頁，從Club匯入
	Activity: {
		screen: requireAppFlow(ActivityPage),
		navigationOptions: ({ navigation }) => ({
			headerTitleStyle: {
				color: '#666666',
				fontSize: 18,
				fontFamily: 'Courier',
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			}
		})
	},
},
	{
		navigationOptions: ({ navigation }) => ({
			headerBackTitleStyle: {
				color: '#0d4273',
				fontSize: 15,
			},
			headerBackImage: (
				<TouchableOpacity onPress={() => { navigation.goBack(); }}>
					<Image source={require('../images/images2/arrowLeftBlue.png')}
						style={{ width: 25, height: 25 }} />
				</TouchableOpacity>
			)
		})
	})
