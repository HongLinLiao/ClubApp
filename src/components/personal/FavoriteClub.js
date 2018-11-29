import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from "react-native";
import Overlayer from "../common/Overlayer";
import styles from "../../styles/personal/FavoriteClub";

class FavoriteClub extends React.Component {
  state = {
    loading: false
  };

  dislike = cid => {
    Alert.alert(
      "取消收藏社團",
      "確定要取消收藏社團(一旦取消收藏社團相關資料將被刪除))",
      [
        {
          text: "再思考一下",
          onPress: () => console.log("再思考一下"),
          style: "cancel"
        },
        { text: "取消收藏", onPress: () => this.handleDislike(cid) }
      ],
      { cancelable: false }
    );
  };
  handleDislike = async cid => {
    try {
      this.setState({ loading: true });
      const { likeClubs, homeClubList, dislikeTheClub, homeClubSelect } = this.props;
      const { clubName, schoolName } = likeClubs[cid];
      await dislikeTheClub(cid);

      Alert.alert("已取消收藏 " + clubName + " " + schoolName);
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
      Alert.alert(e.toString());
      this.setState({ loading: false });
    }
  };

  render() {
    const { likeClubs } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView>
          {Object.keys(likeClubs).map((cid, index) => {
            const { clubName, schoolName } = likeClubs[cid];
            return (
              <View style={styles.listView} key={cid}>
                <View style={styles.textArea}>
                  <Text style={styles.school}>{schoolName}</Text>
                  <Text style={styles.club}>{clubName}</Text>
                </View>
                <View>
                  <TouchableOpacity onPress={() => this.dislike(cid)}>
                    <Image
                      source={require("../../images/garbage.png")}
                      style={styles.garbageIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        {this.state.loading ? <Overlayer /> : null}
      </View>
    );
  }
}

export default FavoriteClub;