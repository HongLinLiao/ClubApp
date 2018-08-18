import { createStackNavigator } from 'react-navigation'
import HomePage from '../containers/home/HomePage'
import PostPage from '../containers/club/PostPage'
import SelectingPage from '../containers/home/SelectingPage'
// import HomeActivitiesPage from '../containers/club/HomeActivitiesPage'
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
  Selecting:{
    screen: requireAppFlow(SelectingPage)
  }
  // 動態貼文列表
  // Stories:{
  //   screen: HomeActivitiesPage
  // },
  // 動態貼文內頁，從Club匯入
  // Activity:{
  //   screen: ActivityPage
  // },
})