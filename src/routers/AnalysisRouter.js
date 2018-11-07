import AnalysisPage from '../containers/analysis/AnalysisPage'
import AnalysisDetailsPage from '../containers/analysis/AnalysisDetailsPage'
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import { Image, TouchableOpacity } from 'react-native'
import React from 'react'


export default createStackNavigator({
	Analysis: {
		screen: AnalysisPage,
		navigationOptions: ({ navigation }) => ({
			title: '社團分析',
			headerBackTitle:'上一頁',
			headerBackTitleStyle:{
				color:'#0d4273'},
			headerTitleStyle: {
				color: '#666666',
				fontSize: 20,
				fontFamily: 'Courier'
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},

		})
	},
	AnalysisDetails: {
		screen: AnalysisDetailsPage,
		navigationOptions: ({ navigation }) => ({
			headerTitleStyle: {
				color: '#666666',
				fontSize: 20,
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},
			headerBackImage: (
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image source={require('../images/images2/arrowLeftBlue.png')}
						style={{ width: 25, height: 25 }} />
				</TouchableOpacity>
			)
		})
	},

	
},
{
	navigationOptions: ({ navigation }) => ({
		headerBackTitleStyle: {
			color: '#0d4273',
			fontSize: 15,
		}
	})
})

// export default createStackNavigator({
//     Analysis: AnalysisPage
// })