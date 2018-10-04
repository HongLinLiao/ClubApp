import { createStackNavigator } from 'react-navigation'
import SearchPage from '../containers/search/SearchPage'
import SearchClubPage from '../containers/search/SearchClubPage'


export default createStackNavigator({
    Search: {
        screen: SearchPage
    },
    SearchClub: {
        screen: SearchClubPage
    }
})