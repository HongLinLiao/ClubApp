import React from "react";
import {
  View,
  Button,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";

import { ListItem } from "react-native-elements";

import { searchAllClubs } from "../../modules/Data";
import Overlayer from "../common/Overlayer";
import styles from "../../styles/search/Search";
class Search extends React.Component {
  state = {
    loading: false,
    searching: false,
    text: "",
    dataArray: [],
    tempArray: []
  };

  componentWillMount() {
    this.props.navigation.setParams({
      handleSearchFilter: this.handleSearchFilter.bind(this),
      search: this.search.bind(this)
    });
  }

  async componentDidMount() {
    // const dataArray = await searchAllClubs()
    // this.setState({dataArray})
    // console.log(dataArray)
  }

  search = async () => {
    this.setState({ loading: true });
    const dataArray = await searchAllClubs();
    this.setState({ dataArray });
    console.log(dataArray);

    this.setState({ loading: false });
  };

  handleLikeTheClub = async cid => {
    try {
      this.setState({ loading: true });

      await this.props.likeTheClub(cid);

      this.setState({ loading: false });

      Alert.alert("已成功收藏!");
    } catch (e) {
      Alert.alert(e.toString());
    }
  };

  handleSearchFilter = async text => {
    try {
      this.setState({ searching: true });

      const newText = text.replace(/\s+/g, "").split(""); //去除空白並把每個字分割
      console.log(newText);

      if (newText.length != 0) {
        const newDataArray = this.state.dataArray.filter(item => {
          const combindName = item.schoolName + item.clubName;
          let isMatch = true;
          newText.filter(char => {
            let charMatch = combindName.indexOf(char) > -1;
            if (!charMatch) isMatch = false; //只要有一個字不對就不列入
          });
          return isMatch;
        });
        this.setState({ text, tempArray: newDataArray });
        setTimeout(() => {
          this.setState({ searching: false });
        }, 500);
      } else {
        this.setState({ searching: false, text, tempArray: [] });
      }
    } catch (e) {
      this.setState({ searching: false });
    }
  };

  handleGoToClub = async (club, status) => {
    try {
      const { setCurrentClub } = this.props;

      if (status.hasJoin) {
        setCurrentClub(club.cid);
        this.props.navigation.navigate("ClubRouter");
      } else {
        this.props.navigation.push("SearchClub", { club, status });
      }
    } catch (e) {}
  };

  filterClubStatus = club => {
    const { joinClub, likeClub } = this.props;
    const joinClubCids = Object.keys(joinClub);
    const likeClubCids = Object.keys(likeClub);

    let hasJoin = false;
    let hasLike = false;
    joinClubCids.map(cid => {
      if (club.cid == cid) hasJoin = true;
    });
    likeClubCids.map(cid => {
      if (club.cid == cid) hasLike = true;
    });

    return { hasJoin, hasLike };
  };
  //我把listitem都刪掉了
  render() {
    return (
      <ScrollView style={{ backgroundColor: "#ffffff" }}>
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          {
            // <Text>{this.state.dataArray.length}</Text>
          }
          <View style={{ flex: 1 }}>
            {this.state.tempArray.map((club, index) => {
              const status = this.filterClubStatus(club);

              return (
                <TouchableOpacity
                  key={club.cid}
                  onPress={() =>
                    this.props.navigation.push("SearchClub", { club, status })
                  }
                >
                  <View style={styles.card}>
                    <ImageBackground
                      source={{ uri: club.imgUrl }}
                      style={styles.clubBackground}
                    />
                    <View style={styles.clubNameView}>
                      <Text style={styles.clubNameText}>{club.schoolName}</Text>
                      <Text style={styles.clubNameText}>{club.clubName}</Text>
                    </View>
                    <View style={styles.clubIntroView}>
                      <Text style={styles.clubIntroText}>{club.initDate}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {this.state.searching ? <Overlayer /> : null}
          </View>

          {this.state.loading ? <Overlayer /> : null}
        </View>
      </ScrollView>
    );
  }
}

export default Search;
