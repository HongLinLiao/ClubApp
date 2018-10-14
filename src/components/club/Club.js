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
  ImageBackground
} from 'react-native'

import Expo from 'expo'
import ModalDropdown from 'react-native-modal-dropdown';
import { randomCid, getClubMemberData, filterOpenClub } from '../../modules/Club'
import { getPostKeyListFromClubKey } from '../../modules/Post'
import PostListElement from '../post/PostListElement'
import { joinOrLikeClub } from '../../modules/Common'
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog'
import styles from "../../styles/club/Club";

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class Club extends React.Component {
  state = {
    activities: {
      act1: {},
      act2: {},
      act3: {}
    },
    postKey: {},
    post: {},
    userData: { _uid: null, _user: null, _clubs: null},
    loading: false,
    currentCid: null
  };

  async componentWillMount() {
    const { joinClubs, likeClubs, currentCid } = this.props;
    // const _likeClubs = filterOpenClub(likeClubs)
    // let allClubCids = Object.keys(joinClubs).concat(Object.keys(_likeClubs));

    // const cid = randomCid(allClubCids);
    // this.props.setCurrentClub(cid);
    await this.postReload(currentCid);
  }


  //檢查社團是否公開(蒐藏)
  checkTheClubOpen = (currentCid, joinClubs, likeClubs, setCurrentClub) => {
    let cid = currentCid
    if(cid) {
      const type = joinOrLikeClub(cid);
      if(type == 'LIKE') {
        if(likeClubs[currentCid].open == false) { //蒐藏社團被設為不公開
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

  //貼文重整
  postReload = async (clubKey) => {
    const { getPostDataComplete } = this.props;
    const postKey = await getPostKeyListFromClubKey(clubKey);
    const postData = await getPostDataComplete(postKey);
    this.setState({ postKey: postKey, post: postData });
  };
  //更改postList
  setPostList = (postList) => {
    this.setState({ post: postList });
  };

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
        if(likeClubs[cid].open) {
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

  addLike = () => {};

  showUser = async (_uid) => {
    try {
        this.popupDialog.show(async () => {
            this.setState({loading: true, userData: { _uid: null, _user: null, _clubs: null}})
            const userData = { _uid, _user: {}, _clubs: {}}
            const user = await getUserData(_uid)

            if(user.joinClub) {
                const promises = Object.keys(user.joinClub).map(async (cid) => {
                    const club = await getClubData(cid)
                    userData._clubs[cid] = club
                })

                await Promise.all(promises)
            }

            userData._user = user
            console.log(userData)

            this.setState({userData, loading: false})
        });
    } catch(e) {
        Alert.alert(e.toString())
    }
    
  }


  render() {
    if (this.props.currentCid) {
      const newPostList = { ...this.state.post };
      const { user, joinClubs, likeClubs, currentCid } = this.props;
      const { _uid, _user, _clubs } = this.state.userData
      let type = joinOrLikeClub(currentCid);
      let clubs = {};
      let status = "";
      if (type == "JOIN") {
        clubs = joinClubs;
        status = clubs[currentCid].member[user.uid].status;
      } else if (type == "LIKE") {
        clubs = likeClubs;
        status = "路人";
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
            <ScrollView>
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
                    source={{ uri: imgUrl ? imgUrl : 'https://steamuserimages-a.akamaihd.net/ugc/87100177918375746/EDFEECCE614D4A17D884A5E5B7E9D5810C4C1312/' }}
                    resizeMode="cover"
                    style={styles.clubBackground}
                  >
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
                          {status}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </View>

              {type == "JOIN" ? (
                <View style={styles.adminButtonView}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.push("AddPost", {})}
                  >
                    <View style={styles.adminButton}>
                      <Image
                        source={require("../../images/images2/contract.png")}
                        style={styles.adminIcon}
                      />

                      <Text style={styles.adminText}>發布文章</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.push("AddActivity", {})
                    }
                  >
                    <View style={styles.adminButton}>
                      <Image
                        source={require("../../images/images2/idea.png")}
                        style={styles.adminIcon}
                      />
                      <Text style={styles.adminText}>舉辦活動</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.props.navigation.push("ClubAdmin", {})}
                  >
                    <View style={styles.adminButton}>
                      <Image
                        source={require("../../images/images2/manager.png")}
                        style={styles.adminIcon}
                      />
                      <Text style={styles.adminText}>管理者模式</Text>
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
                      <Text style={styles.adminText}>編輯成員</Text>
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

                    <TouchableOpacity
                      style={styles.moreView}
                      onPress={() => {}}
                    >
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
                      showUser={this.showUser.bind(this)}
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

            <ModalDropdown
              defaultValue="選擇其他社團 ▼"
              // defaultValue={schoolName + "  " + clubName}
              style={styles.modal}
              textStyle={styles.modalText}
              dropdownStyle={styles.modalDown}
              options={clubsArray}
              onSelect={(index, rowData) => {
                this.props.setCurrentClub(rowData.cid);
                this.postReload(rowData.cid);
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
              dialogStyle={{borderRadius: 20}}
          >
              <UserDialog
                  uid={_uid}
                  user={_user}
                  clubs={_clubs}
              />
              {this.state.loading ? <Overlayer /> : null}
          </PopupDialog> 
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#666666"
            }}
          >
            沒有可以顯示的社團
          </Text>
        </View>
      );
    }
  }
}

export default Club;
