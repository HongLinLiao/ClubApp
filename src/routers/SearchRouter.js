import { createStackNavigator } from 'react-navigation'
import SearchPage from '../containers/search/SearchPage'


export default createStackNavigator({
    Search: {
        screen: SearchPage
    }
})