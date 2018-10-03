import { createStackNavigator } from 'react-navigation'
import HomePage from '../containers/home/HomePage'
import PostPage from '../containers/club/PostPage'
import SelectingPage from '../containers/home/HomeSelectingPage'
import HomeActivitiesPage from '../containers/home/HomeActivitiesPage'
// import ActivityPage from '../containers/club/ActivityPage'
import requireAppFlow from '../containers/flowControll/requireAppFlow'

export default createStackNavigator({
  //預設首頁
  Home: {
    screen: requireAppFlow(HomePage)
  },
  // 貼文內頁，從Club匯入
  Post:{
    screen: requireAppFlow(PostPage)
  },
  //篩選
  Selecting:{
    screen: requireAppFlow(SelectingPage)
  },
  // 動態貼文列表
  Stories:{
    screen: requireAppFlow(HomeActivitiesPage)
  },
  // 動態貼文內頁，從Club匯入
  // Activity:{
  //   screen: ActivityPage
  // },
})