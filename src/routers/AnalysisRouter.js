import AnalysisPage from '../containers/analysis/AnalysisPage'
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'


export default createMaterialTopTabNavigator({
    Analysis: AnalysisPage,
    Analysis2: AnalysisPage,
})

// export default createStackNavigator({
//     Analysis: AnalysisPage
// })