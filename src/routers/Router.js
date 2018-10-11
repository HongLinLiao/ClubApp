import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from "react-navigation";
import AuthRouter from "./AuthRouter";
import HomeRouter from "./HomeRouter";
import ClubRouter from "./ClubRouter";
import PersonalRouter from "./PersonalRouter";
import FirstLoginRouter from "./FirstLoginRouter";
import UserRouter from "./UserRouter";
import SearchRouter from "./SearchRouter";
import AnalysisRouter from "./AnalysisRouter";

import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
//第三層
const MainRouter = createBottomTabNavigator(
  {
    Home: {
      screen: HomeRouter,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={24} />
        )
      }
    },
    Search: {
      screen: SearchRouter,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-search" color={tintColor} size={24} />
        )
      }
    },
    Club: {
      screen: ClubRouter,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-star" color={tintColor} size={24} />
        )
      }
    },
    Analysis: AnalysisRouter,
    Personal: {
      screen: PersonalRouter,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-settings" color={tintColor} size={24} />
        )
      }
    }
  },

  {
    initialRouteName: "Search",
    order: ["Search", "Home", "Club", "Analysis", "Personal"],
    swipeEnabled: true, //滑動可換頁，失敗
    tabBarOptions: {
      activeTintColor: "#f6b456", //字有按
      inactiveTintColor: "#0d4273", //字沒按
      activeBackgroundColor: "#0d4273", //背景有按
      inactiveBackgroundColor: "#f6b456" //背景沒按
    }
  },

  {
    navigationOptions: ({ navigation }) => {
      const { index, routes } = navigation.state;
      return {
        tabBarVisible: !(routes[index].routeName == "AddPost"),
        animationEnabled: true,
        swipeEnabled: true
      };
    }
  }
);

//第二層
const AppRouter = createSwitchNavigator({
  UserRouter: UserRouter,
  FirstLoginRouter: FirstLoginRouter,
  MainRouter: MainRouter
});

//第一層
const createRootRouter = () => {
  return createSwitchNavigator({
    AuthRouter: AuthRouter,
    AppRouter: AppRouter
  });
};

export default createRootRouter;
