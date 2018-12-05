import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  RefreshControl,
  Alert,
} from 'react-native'

import Expo from 'expo'
import ModalDropdown from 'react-native-modal-dropdown';
import { randomCid } from '../../modules/Club'
import PostListElement from '../post/PostListElement'
import { joinOrLikeClub, convertClubStatus } from '../../modules/Common'
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog'
import styles from "../../styles/club/Club";

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

class Club extends React.Component {
  state = {
    post: [],
    activity: [],
    userData: { _uid: null, _user: null, _clubs: null },
    loading: false,
    currentCid: null,
    //重整
    refreshing: false,
  };

  async componentWillMount() {
    const { joinClubs, likeClubs, currentCid, initSetPostList, initSetActivityList, navigation } = this.props;
    // const _likeClubs = filterOpenClub(likeClubs)
    // let allClubCids = Object.keys(joinClubs).concat(Object.keys(_likeClubs));

    // const cid = randomCid(allClubCids);
    // this.props.setCurrentClub(cid);
    await initSetPostList(newPostList => { this.setState({ post: newPostList }); }, navigation);
    await initSetActivityList(newActivityList => { this.setState({ activity: newActivityList }); }, navigation);
    if (currentCid) {
      this.clubOverLayar()
      await this.postReload(currentCid)
      await this.activityReload(currentCid);
      this.clubOverLayar()
    }
  }

  //重整
  onRefresh = async () => {
    try {
      const { currentCid, likeClubs, setCurrentClub } = this.props;
      let openClubCid = null
      if (currentCid) {
        this.setState({ refreshing: true, loading: true });
        await this.activityReload(currentCid);
        await this.postReload(currentCid);
      } else {
        Object.keys(likeClubs).map((cid) => {
          const { open } = likeClubs[cid]
          if (open) openClubCid = cid
        })

        setCurrentClub(openClubCid)
      }

      this.setState({ refreshing: false, loading: false });
    } catch (error) {
      console.log(error.toString());
    }
  }

  //貼文重整
  postReload = async (clubKey) => {
    const { getClubPostReload, navigation } = this.props;
    await getClubPostReload(clubKey, navigation);
  };

  //活動重整
  activityReload = async (clubKey) => {
    const { getClubActivityReload, navigation } = this.props;
    await getClubActivityReload(clubKey, navigation);
  };

  //活動按讚
  pressActivityFavorite = async (activity) => {
    const { setActivityFavorite, syncActivity, syncActivityDelete } = this.props;
    this.clubOverLayar();
    let obj = await setActivityFavorite(activity.clubKey, activity.activityKey);
    if (obj != null) {
      //活動同步
      syncActivity(obj);
    }
    else {
      //刪除活動同步
      syncActivityDelete(activity.activityKey);
      alert("該活動不存在！");
    }
    this.clubOverLayar();
  }

  //進入活動內頁
  insideActivity = async (activity) => {
    const { getInsideActivity, syncActivity, navigation, syncActivityDelete } = this.props;
    this.clubOverLayar()
    const obj = await getInsideActivity(activity.clubKey, activity.activityKey);
    if (obj != null) {
      this.clubOverLayar();
      let routeName;
      if (navigation.state.routeName == 'Stories') {
        routeName = 'HomeActivity'
      }
      else {
        routeName = navigation.state.routeName + "Activity";
      }
      navigation.navigate(routeName, {
        activity: obj.activity,
        syncActivityBack: this.props.syncActivityBack
      });
    }
    else {
      //刪除活動同步
      syncActivityDelete(activity.activityKey);
      Alert.alert("該活動不存在！");
      this.clubOverLayar();
    }
  };



  //檢查社團是否公開(收藏)
  checkTheClubOpen = (currentCid, joinClubs, likeClubs, setCurrentClub) => {
    let cid = currentCid
    if (cid) {
      const type = joinOrLikeClub(cid);
      if (type == 'LIKE') {
        if (likeClubs[currentCid].open == false) { //收藏社團被設為不公開
          let joinClubCids = Object.keys(joinClubs)
          cid = randomCid(joinClubCids)
          // this.setState({currentCid: cid})
          setCurrentClub(cid)
        }
      }
    } else {
      let joinClubCids = Object.keys(joinClubs)
      cid = randomCid(joinClubCids)
      setCurrentClub(cid)
    }

    return cid
  }

  generateClubsArray = () => {
    const { joinClubs, likeClubs } = this.props;
    let clubsArray = [];
    if (Object.keys(joinClubs).length != 0) {
      Object.keys(joinClubs).map(cid => {
        clubsArray.push({
          cid: cid,
          schoolName: joinClubs[cid].schoolName,
          clubName: joinClubs[cid].clubName
        });
      });
    }
    if (Object.keys(likeClubs).length != 0) {
      Object.keys(likeClubs).map(cid => {
        if (likeClubs[cid].open) {
          clubsArray.push({
            cid: cid,
            schoolName: likeClubs[cid].schoolName,
            clubName: likeClubs[cid].clubName
          });
        }
      });
    }
    return clubsArray;
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

  addLike = () => { };

  showUser = async (_uid) => {
    try {
      this.popupDialog.show(async () => {
        this.setState({ loading: true, userData: { _uid: null, _user: null, _clubs: null } })
        const userData = { _uid, _user: {}, _clubs: {} }
        const user = await getUserData(_uid)

        if (user.joinClub) {
          const promises = Object.keys(user.joinClub).map(async (cid) => {
            const club = await getClubData(cid)
            userData._clubs[cid] = club
          })

          await Promise.all(promises)
        }

        userData._user = user
        this.setState({ userData, loading: false })
      });
    } catch (e) {
      Alert.alert(e.toString())
    }
  }

  //過門
  clubOverLayar = () => {
    this.setState({ loading: !this.state.loading });
  }


  render() {
    if (this.props.currentCid) {
      const newPostList = this.state.post.slice();
      const newActivityList = this.state.activity.slice();
      const { user, joinClubs, likeClubs, currentCid } = this.props;
      const { _uid, _user, _clubs } = this.state.userData
      let type = joinOrLikeClub(currentCid);
      let clubs = {};
      let status = '';
      let _status = '';
      if (type == "JOIN") {
        clubs = joinClubs;
        status = clubs[currentCid].member[user.uid].status;
        _status = convertClubStatus(status)
      } else if (type == "LIKE") {
        clubs = likeClubs;
        _status = "收藏者";
      }

      const { schoolName, clubName, open, member, introduction, imgUrl } = clubs[currentCid];
      const numberOfMember = Object.keys(member).length;
      const clubsArray = this.generateClubsArray();

      return (
        <View
          style={{
            flex: 1,
            marginTop: Expo.Constants.statusBarHeight,
            backgroundColor: "#ffffff"
          }}
        >
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
              <View
                style={{
                  height: 400,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{ position: "absolute", height: 400, width: "100%" }}
                >
                  <ImageBackground
                    source={{ uri: imgUrl ? imgUrl : 'https://upload.wikimedia.org/wikipedia/en/d/d3/No-picture.jpg' }}
                    resizeMode="cover"
                    style={styles.clubBackground}
                  >
                    <TouchableOpacity style={styles.createClubBtn} onPress={() => this.props.navigation.navigate('CreateClub')}>
                      <Image source={require('../../images/add-group.png')} style={{ width: 40, height: 40 }} />
                    </TouchableOpacity>
                    <View style={styles.clubInfoView}>
                      <View style={styles.clubLeftTextView}>
                        <Text style={styles.schoolText}>{schoolName}</Text>
                        <Text style={styles.clubTopNameText}>{clubName}</Text>
                      </View>
                      <View style={styles.clubRightTextView}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.numberext}>
                            {numberOfMember}
                            位成員
                          </Text>
                          <Text style={styles.numberext}>
                            {open ? "公開" : "非公開"}
                          </Text>
                        </View>
                        <Text style={styles.numberext}>
                          你的身分：
                          {_status}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </View>

              {type == "JOIN" ? (
                <View style={styles.adminButtonView}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.push("AddPost", { onRefresh: this.onRefresh })}
                  >
                    <View style={styles.adminButton}>
                      <Image
                        source={require("../../images/images2/contract.png")}
                        style={styles.adminIcon}
                      />

                      <Text style={styles.adminOpenText}>發佈文章</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={status == 'member'}
                    onPress={() =>
                      this.props.navigation.push("AddActivity", { onRefresh: this.onRefresh })
                    }
                  >
                    <View style={styles.adminButton}>
                      {
                        status == 'member' ?
                          <Image
                            source={require('../../images/idea-gray.png')}
                            style={styles.adminIcon}
                          /> :
                          <Image
                            source={require('../../images/idea.png')}
                            style={styles.adminIcon}
                          />
                      }
                      <Text style={status == 'member' ? styles.adminCloseText : styles.adminOpenText}>舉辦活動</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={status != 'master'}
                    onPress={() => this.props.navigation.push("ClubAdmin", {})}
                  >
                    <View style={styles.adminButton}>
                      {
                        status == 'master' ?
                          <Image
                            source={require("../../images/images2/manager.png")}
                            style={styles.adminIcon}
                          /> :
                          <Image
                            source={require('../../images/manager-gray.png')}
                            style={styles.adminIcon}
                          />
                      }
                      <Text style={status == 'master' ? styles.adminOpenText : styles.adminCloseText}>管理者模式</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.navigation.push("ClubMember")}>
                    <View style={styles.adminButton}>
                      <View style={styles.adminIcon}>
                        <Image
                          source={require("../../images/images2/changeMember.png")}
                          style={styles.adminIcon}
                        />
                      </View>
                      <Text style={styles.adminOpenText}>{status == 'member' ? '查看成員' : '成員管理'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
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
                    {
                      newActivityList.map((activityElement) => (
                        Object.values(activityElement).map((activity) => (
                          <TouchableOpacity
                            key={activity.activityKey}
                            onPress={async () => { await this.insideActivity(activity) }}
                          >
                            <ImageBackground
                              source={{ uri: activity.photo }}
                              style={styles.clubActivity}
                              imageStyle={styles.borderRadius30}
                            >
                              <View style={styles.heartView}>
                                <TouchableOpacity style={styles.heartView}
                                  onPress={async () => { await this.pressActivityFavorite(activity); }}>
                                  <Image
                                    style={styles.likeIcon}
                                    source={activity.statusFavorite ? require("../../images/like-orange.png") : require("../../images/like-gray.png")}
                                  />
                                  <Text style={styles.heartText}> {activity.numFavorites}</Text>
                                </TouchableOpacity>
                              </View>
                            </ImageBackground>
                          </TouchableOpacity>
                        ))
                      ))
                    }
                    {/* <TouchableOpacity
                      style={styles.moreView}
                      onPress={() => { }}
                    >
                      <Text style={styles.moreText}>更多</Text>
                      <Image
                        source={require("../../images/images2/arrowRight.png")}
                        style={styles.arrow}
                      />
                    </TouchableOpacity> */}
                  </View>
                </ScrollView>
              </View>

              <View>
                <View style={styles.titleTextView}>
                  <Text style={styles.titleText}>最新文章</Text>
                </View>
                {
                  newPostList.map((postElement) => (
                    Object.values(postElement).map((post) => (
                      <PostListElement
                        key={post.postKey}
                        post={post}
                        navigation={this.props.navigation}
                        getInsidePost={this.props.getInsidePost}
                        setPostFavorite={this.props.setPostFavorite}
                        showUser={this.showUser.bind(this)}
                        parentOverLayor={this.clubOverLayar}
                        syncPost={this.props.syncPost}
                        syncPostDelete={this.props.syncPostDelete}
                        syncPostBack={this.props.syncPostBack}
                      >
                      </PostListElement>
                    ))
                  ))
                }
                {/* <View style={styles.moreView}>
                  <TouchableOpacity onPress={() => { }}>
                    <Text style={styles.moreText}>查看更多</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            </ScrollView>

            <ModalDropdown
              defaultValue="選擇其他社團 ▼"
              // defaultValue={schoolName + "  " + clubName}
              style={styles.modal}
              textStyle={styles.modalText}
              dropdownStyle={styles.modalDown}
              options={clubsArray}
              onSelect={async (index, rowData) => {
                this.props.setCurrentClub(rowData.cid);
                this.clubOverLayar()
                await this.activityReload(rowData.cid);
                await this.postReload(rowData.cid);
                this.clubOverLayar()
              }}
              renderButtonText={rowData =>
                rowData.schoolName + "  " + rowData.clubName + " ▼"
              }
              renderRow={(rowData, rowId) => {
                const { schoolName, clubName } = rowData;
                return (
                  <Text style={styles.modalDownText}>
                    {schoolName + "  " + clubName}
                  </Text>
                );
              }}
            />
          </View>
          <PopupDialog
            ref={(popupDialog) => this.popupDialog = popupDialog}
            dialogAnimation={slideAnimation}
            width={0.7}
            height={0.7}
            dialogStyle={{ borderRadius: 20 }}
          >
            <UserDialog
              uid={_uid}
              user={_user}
              clubs={_clubs}
              loading={this.state.loading}
            />
          </PopupDialog>
          {this.state.loading ? <Overlayer /> : null}
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ScrollView
            contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh()}
                tintColor='#f6b456'
              />
            }
          >
            <Text
              style={{
                fontSize: 30,
                color: "#0d4273",
                marginBottom: 15,
              }}
            >
              沒有可以顯示的社團
            </Text>
            <Text style={{
              fontSize: 20,
              color: "#0d4273",
              marginBottom: 10,
            }}>下拉重整</Text>
            <Text style={{
              fontSize: 15,
              color: "#0d4273",
              marginBottom: 10,
            }}>或是</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateClub')}>
              <Text style={{
                fontSize: 20,
                color: "#639af2"
              }}>創建社團</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
  }
}

export default Club;
