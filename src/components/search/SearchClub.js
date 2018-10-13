import React from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ImageBackground
} from "react-native";

import Expo from "expo";

import ModalDropdown from "react-native-modal-dropdown";
import { randomCid, getClubMemberData } from "../../modules/Club";
import Overlayer from "../common/Overlayer";
import PostListElement from "../post/PostListElement";
import { getPostKeyListFromClubKey } from "../../modules/Post";
import styles from "../../styles/club/Club";

class SearchClub extends React.Component {
  state = {
    activities: {
      act1: {},
      act2: {},
      act3: {}
    },
    post: {},
    postKey: {},
    loading: false,
    hasJoin: false,
    hasLike: false
  };

  async componentWillMount() {
    const { navigation } = this.props;
    const { hasJoin, hasLike } = navigation.state.params.status;
    this.setState({
      hasJoin,
      hasLike: hasJoin ? hasJoin : hasLike
    });
    await this.postReload(navigation.state.params.club.cid);
  }

  //貼文重整
  postReload = async clubKey => {
    const { getPostDataComplete } = this.props;
    const postKey = await getPostKeyListFromClubKey(clubKey);
    const postData = await getPostDataComplete(postKey);
    this.setState({ postKey: postKey, post: postData });
  };
  //更改postList
  setPostList = postList => {
    this.setState({ post: postList });
  };

  askToAddLike = () => {
    Alert.alert(
      "建立活動",
      "您將建立 " + this.state.title + " 活動於 " + schoolName + " " + clubName,
      [
        { text: "取消", onPress: () => console.log("取消"), style: "cancel" },
        { text: "建立", onPress: () => this.addLike() }
      ],
      { cancelable: false }
    );
  };

  addLike = () => {};

  handleJoinClub = async cid => {
    try {
      this.setState({ loading: true });

      await this.props.joinTheClub(cid);

      this.props.navigation.popToTop();

      this.setState({ loading: false });

      Alert.alert("已成功加入!");
    } catch (e) {
      Alert.alert(e.toString());
    }
  };

  handleLikeTheClub = async cid => {
    try {
      this.setState({ loading: true });

      await this.props.likeTheClub(cid);

      this.setState({ loading: false, hasLike: true });

      Alert.alert("已成功蒐藏!");
    } catch (e) {
      Alert.alert(e.toString());
    }
  };

  render() {
    const { user, navigation } = this.props;
    const { hasJoin, hasLike } = this.state;
    const { club } = navigation.state.params;
    const { schoolName, clubName, open, member, introduction, imgUrl } = club;
    const numberOfMember = Object.keys(member).length;
    const newPostList = { ...this.state.post };

    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ height: 400 }}>
              <View
                style={{ position: "absolute", height: 400, width: "100%" }}
              >
                {imgUrl ? (
                  <ImageBackground
                    source={{ uri: imgUrl }}
                    resizeMode="cover"
                    style={styles.clubBackground}
                  >
                    <View style={styles.clubInfoView}>
                      <View style={styles.clubTextView}>
                        <View style={styles.clubLeftTextView}>
                          <Text style={styles.schoolText}>{schoolName}</Text>
                          <Text style={styles.clubTopNameText}>{clubName}</Text>
                        </View>
                        <View style={styles.clubRightTextView}>
                          <Text style={styles.numberext}>
                            {open ? "公開" : "非公開"}
                          </Text>
                          <Text style={styles.numberext}>
                            {numberOfMember}
                            位成員
                          </Text>
                        </View>
                      </View>
                      <View style={styles.joinAndLikeView}>
                        <TouchableOpacity
                          style={[
                            styles.joinAndLikeTouch,
                            { backgroundColor: hasJoin ? "#0d4273" : "#f6b456" }
                          ]}
                          disabled={hasJoin}
                          onPress={() => this.handleJoinClub(club.cid)}
                        >
                          <Text
                            style={[
                              styles.joinAndLikeText,
                              { color: hasJoin ? "#f6b456" : "#0d4273" }
                            ]}
                          >
                            {hasJoin ? "已加入" : "加入社團"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.joinAndLikeTouch,
                            { backgroundColor: hasLike ? "#0d4273" : "#f6b456" }
                          ]}
                          disabled={hasLike}
                          onPress={() => this.handleLikeTheClub(club.cid)}
                        >
                          <Text
                            style={[
                              styles.joinAndLikeText,
                              { color: hasLike ? "#f6b456" : "#0d4273" }
                            ]}
                          >
                            {hasLike ? "已蒐藏" : "蒐藏社團"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                ) : null}
              </View>
            </View>

            <View style={styles.titleTextView}>
              <Text style={styles.titleText}>社團簡介</Text>
            </View>
            <View style={styles.clubSummaryView}>
              <Text style={styles.clubSummaryText}>{introduction}</Text>
            </View>

            <View>
              <View style={styles.titleTextView}>
                <Text style={styles.titleText}>最新活動</Text>
              </View>
              <ScrollView horizontal>
                <View style={{ flexDirection: "row" }}>
                  {Object.keys(this.state.activities).map((actId, index) => {
                    return (
                      <TouchableOpacity key={actId}>
                        <ImageBackground
                          source={require("../../images/poster1.jpg")}
                          style={styles.clubActivity}
                          imageStyle={styles.borderRadius30}
                        >
                          <View style={styles.heartView}>
                            <Text style={styles.heartText}>220</Text>
                            <Image
                              source={require("../../images/images2/like.png")}
                              style={styles.likeIcon}
                            />
                          </View>
                        </ImageBackground>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity style={styles.moreView} onPress={() => {}}>
                    <Text style={styles.moreText}>更多</Text>
                    <Image
                      source={require("../../images/images2/arrowRight.png")}
                      style={styles.arrow}
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            <View>
              <View style={styles.titleTextView}>
                <Text style={styles.titleText}>最新文章</Text>
              </View>
              {Object.values(newPostList).map(clubElement =>
                Object.values(clubElement).map(postElement => (
                  <PostListElement
                    key={postElement.postKey}
                    post={postElement}
                    navigation={this.props.navigation}
                    getInsidePost={this.props.getInsidePost}
                    getPostComment={this.props.getPostComment}
                    setPostFavorite={this.props.setPostFavorite}
                    postList={this.state.post}
                    setPostList={this.setPostList}
                  />
                ))
              )}
              <View style={styles.moreView}>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.moreText}>查看更多</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        {this.state.loading ? <Overlayer /> : null}
      </View>
    );
  }
}

export default SearchClub;
