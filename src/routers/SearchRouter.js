import { createStackNavigator } from 'react-navigation'
import SearchPage from '../containers/search/SearchPage'
import SearchClubPage from '../containers/search/SearchClubPage'
import PostPage from '../containers/club/PostPage'


export default createStackNavigator({
    Search: {
        screen: SearchPage
    },
    SearchClub: {
        screen: SearchClubPage
    },
    Post: {
        screen: PostPage
    },
})