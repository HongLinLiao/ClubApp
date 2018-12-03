import { createStackNavigator } from "react-navigation";
import SearchPage from "../containers/search/SearchPage";
import { TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import SearchClubPage from "../containers/search/SearchClubPage";
import PostPage from "../containers/club/PostPage";
import ActivityPage from '../containers/club/ActivityPage'
import React from "react";
import { View } from "native-base";

export default createStackNavigator({
  Search: {
    screen: SearchPage,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitleStyle: {
          color: "#666666",
          fontSize: 20
        },
        headerStyle: {
          backgroundColor: "white"
        },
        headerTitle: (
          <View style={styles.searchView}>
            <TextInput
              placeholder="輸入想搜尋的學校或社團"
              placeholderTextColor="gray"
              style={{
                height: 36,
                padding: 10,
                backgroundColor: "white",
                flex: 1,
                fontSize: 15
              }}
              onChangeText={text =>
                navigation.state.params.handleSearchFilter(text)
              }
              onFocus={() => navigation.state.params.search()}
            />
            <Image
              source={require("../images/images2/search.png")}
              style={styles.search}
            />
          </View>
        )
      };
    }
  },
  SearchClub: {
    screen: SearchClubPage,
    navigationOptions: ({ navigation }) => ({
      title: '社團',
      headerBackTitle: '上一頁',
      headerTitleStyle: {
        color: '#666666',
        fontSize: 20,
      },
      headerStyle: {
        backgroundColor: '#f6b456'
      },
      headerLeft: (
        <TouchableOpacity onPress={async () => {
          const syncSearchActivityBack = navigation.state.params.syncSearchActivityBack;
          const syncSearchPostBack = navigation.state.params.syncSearchPostBack;
          const routeName = navigation.state.routeName;
          await syncSearchActivityBack(routeName);
          await syncSearchPostBack(routeName);
          navigation.goBack();
        }}
          style={{ flexDirection: 'row' }}
        >
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      )
    }
    )
  },
  SearchActivity: {
    screen: ActivityPage,
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: {
        color: '#666666',
        fontSize: 18,
        fontFamily: 'Courier',
      },
      headerStyle: {
        backgroundColor: '#f6b456'
      },
      headerLeft: (
        <TouchableOpacity onPress={async () => {
          const syncActivityBack = navigation.state.params.syncActivityBack;
          const routeName = navigation.state.routeName;
          await syncActivityBack(routeName);
          navigation.goBack();
        }}
          style={{ flexDirection: 'row' }}
        >
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      )
    }),
  },
  SearchPost: {
    screen: PostPage,
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: {
        color: '#666666',
        fontSize: 25,
        fontFamily: 'Courier',
      },
      headerStyle: {
        backgroundColor: '#f6b456'
      },
      headerLeft: (
        <TouchableOpacity onPress={async () => {
          const syncPostBack = navigation.state.params.syncPostBack;
          const routeName = navigation.state.routeName;
          await syncPostBack(routeName);
          navigation.goBack();
        }}
          style={{ flexDirection: 'row' }}
        >
          <Image source={require('../images/images2/arrowLeftBlue.png')}
            style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      )
    })
  },


});


const styles = StyleSheet.create({
  search: {
    height: 18,
    width: 18,
    marginRight: 10
  },
  searchView: {
    height: 40,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(102,102,102,0.2)",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 13,
    flex: 1
  }
});
{
  navigationOptions: ({ navigation }) => ({
    headerBackTitleStyle: {
      color: '#0d4273',
      fontSize: 15,
    },
    headerBackImage: (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require('../images/images2/arrowLeftBlue.png')}
          style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
    )
  })
}
