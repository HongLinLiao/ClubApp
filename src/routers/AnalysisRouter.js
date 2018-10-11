import AnalysisPage from '../containers/analysis/AnalysisPage'
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'


export default createStackNavigator({
    Analysis: {
        screen: AnalysisPage,
        navigationOptions: ({ navigation }) => ({
			title: '社團分析',
			headerTitleStyle: {
				color: '#666666',
				fontSize: 30,
			},
			headerStyle: {
				backgroundColor: '#f6b456'
			},
		})
    },
    Analysis2: AnalysisPage,
})

// export default createStackNavigator({
//     Analysis: AnalysisPage
// })