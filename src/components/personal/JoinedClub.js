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
import styles from "../../styles/personal/JoinedClub";

class JoinedClub extends React.Component {
  state = {
    loading: false
  };

  quit = cid => {
    Alert.alert(
      "退出社團",
      "確定要退出社團(一旦退出社團相關資料將被刪除))",
      [
        {
          text: "再思考一下",
          onPress: () => console.log("再思考一下"),
          style: "cancel"
        },
        { text: "退出", onPress: () => this.handleQuit(cid) }
      ],
      { cancelable: false }
    );
  };
  handleQuit = async cid => {
    try {
      this.setState({ loading: true });
      const { quitTheClub, joinClubs } = this.props;
      const { clubName, schoolName } = joinClubs[cid];
      await quitTheClub(cid);

      Alert.alert("已退出 " + clubName + " " + schoolName);
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
      Alert.alert(e.toString());
      this.setState({ loading: false });
    }
  };

  render() {
    const { joinClubs } = this.props;
    if (Object.keys(joinClubs).length > 0) {
      return (
        <View style={styles.container}>
          <ScrollView>
            {Object.keys(joinClubs).map((cid, index) => {
              const { clubName, schoolName } = joinClubs[cid];
              return (
                <View style={styles.listView} key={cid}>
                  <View style={styles.textArea}>
                    <Text style={styles.school}>{schoolName}</Text>
                    <Text style={styles.club}>{clubName}</Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => this.quit(cid)}>
                      <Image source={require('../../images/cancel.png')}
                        style={styles.cancelIcon} />
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
    else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 23, color: '#666666' }}>你還沒有加入任何社團唷！</Text>
        </View>
      );
    }
  }
}

export default JoinedClub;
