import AnalysisPage from '../containers/analysis/AnalysisPage'
import AnalysisDetailsPage from '../containers/analysis/AnalysisDetailsPage'
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'


export default createStackNavigator({
    Analysis: {
        screen: AnalysisPage,
        navigationOptions: ({ navigation }) => ({
			title: '社團分析',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 20,
				fontFamily:'Courier'
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},
		})
    },
    AnalysisDetails: {
        screen: AnalysisDetailsPage,
        navigationOptions: ({ navigation }) => ({
			title: '',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 30,
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},
		})
    },
})

// export default createStackNavigator({
//     Analysis: AnalysisPage
// })