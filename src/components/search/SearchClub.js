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
  ImageBackground,
  RefreshControl,
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
    activity: {},
    post: {},
    postKey: {},
    loading: false,
    hasJoin: false,
    hasLike: false,
    refreshing: false,
  };

  async componentWillMount() {
    const { navigation } = this.props;
    const { hasJoin, hasLike } = navigation.state.params.status;
    this.setState({
      hasJoin,
      hasLike: hasJoin ? hasJoin : hasLike
    });
    // this.clubOverLayar();
    // await this.activityReload(navigation.state.params.club.cid);
    // await this.postReload(navigation.state.params.club.cid);
    // this.clubOverLayar();
  }

  //重整
  onRefresh = async () => {
    try {
      this.setState({ refreshing: true });
      this.setState({ refreshing: false });
      // this.clubOverLayar();
      // await this.activityReload(this.props.navigation.state.params.club.cid);
      // await this.postReload(this.props.navigation.state.params.club.cid);
      // this.clubOverLayar();
    } catch (error) {
      console.log(error.toString());
    }
  }

  //過門
  clubOverLayar = () => {
    this.setState({ loading: !this.state.loading });
  }

  //活動重整
  activityReload = async (clubKey) => {
    const { getActivityDataFromClubKey } = this.props;
    const activityData = await getActivityDataFromClubKey(clubKey);
    if (activityData != null) {
      this.setState({ activity: activityData });
    }
    else {
      //不公開社團，只收藏，處理
      //navigation back?
    }
  };
  //進入活動內頁
  insideActivity = async (activity) => {
    const { getInsideActivity, navigation } = this.props;
    this.clubOverLayar();
    const activityData = await getInsideActivity(activity.clubKey, activity.activityKey);
    this.clubOverLayar();
    if (activityData != null) {
      //放進List
      const newActivityList = JSON.parse(JSON.stringify(this.state.activity));
      newActivityList[activityData.clubKey][activityData.activityKey] = activityData;
      this.setState({ activity: newActivityList });

      navigation.navigate('Activity', {
        activity: activityData,
        setActivityList: this.setActivityList,
        activityList: newActivityList,
      });
    }
  };
  //更改activityList
  setActivityList = (activityList) => {
    this.setState({ activity: activityList });
  };
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

      Alert.alert("已成功收藏!");
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
    const newActivityList = { ...this.state.activity };

    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View style={{ flex: 1 }}>
          <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              tintColor='#f6b456'
            />
          }
          >
            <View style={{ height: 400 }}>
              <View
                style={{ position: "absolute", height: 400, width: "100%" }}
              >
                

                  <ImageBackground//可以了
                  source={{ uri: imgUrl ? imgUrl : 'https://upload.wikimedia.org/wikipedia/en/d/d3/No-picture.jpg' }}
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
                            {hasLike ? "已收藏" : "收藏社團"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                
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
                {Object.values(newActivityList).map((clubElement) => (
                      Object.values(clubElement).map((activityElement) => (
                        <TouchableOpacity
                          key={activityElement.activityKey}
                          onPress={async () => { await this.insideActivity(activityElement) }}
                        >
                          <ImageBackground
                            source={{uri:activityElement.photo}}
                            style={styles.clubActivity}
                            imageStyle={styles.borderRadius30}
                          >
                            <View style={styles.heartView}>
                              <Text style={styles.heartText}>{activityElement.numFavorites}</Text>
                              <Image
                                source={require("../../images/images2/like.png")}
                                style={styles.likeIcon}
                              />
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      ))
                    ))}
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
                    parentOverLayor={this.clubOverLayar}
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
