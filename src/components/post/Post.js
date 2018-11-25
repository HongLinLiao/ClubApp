//這頁應該是沒啥問題了
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  RefreshControl,
  Alert
} from "react-native";
import { Button } from "react-native-elements";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import styles from "../../styles/post/Post";
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog'
import Modal from 'react-native-modalbox';

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});
class Post extends React.Component {
  //寫入本地State
  componentWillMount() {
    const { initSetPost, navigation, initPostToReducer } = this.props;
    initSetPost((obj) => { this.setState({ post: obj.post, comment: obj.comment }); }, navigation);
    initPostToReducer({ post: this.props.post, comment: this.props.comment }, navigation);
    this.setState({ post: this.props.post, comment: this.props.comment });
  }

  state = {
    post: {},
    comment: [],
    userData: { uid: null, user: null, clubs: null },
    loading: false,
    refreshing: false,
  };

  //重整動畫
  onRefresh = async () => {
    try {
      this.setState({ refreshing: true });
      this.setState({ refreshing: false });
      this.reload(this.state.post.clubKey, this.state.post.postKey);
    } catch (error) {
      console.log(error.toString());
    }
  }

  //點讚
  pressFavorite = async (clubKey, postKey) => {
    const { setPostFavorite, syncPost, syncPostDelete, navigation } = this.props;
    this.postOverLayar();
    let obj = await setPostFavorite(clubKey, postKey, true);
    if (obj != null) {
      //貼文同步
      syncPost(obj);
      this.postOverLayar();
    }
    else {
      //刪除貼文同步
      syncPostDelete(postKey);
      Alert.alert("該貼文不存在！");
      this.postOverLayar();
      navigation.goBack();
    }
  };

  //刪除貼文
  deletePost = async (clubKey, postKey) => {
    const { deletingPost, navigation, syncPostDelete } = this.props;
    this.postOverLayar();
    const obj = await deletingPost(clubKey, postKey);
    //刪除貼文同步
    syncPostDelete(postKey);
    if (obj.status) {
      Alert.alert("成功刪除！");
      this.postOverLayar();
    }
    else {
      Alert.alert("該貼文不存在！");
      this.postOverLayar();
    }
    navigation.goBack();
  };

  //設定本頁post
  setPost = (postData) => {
    this.setState({ post: postData });
  };

  //過門
  postOverLayar = () => {
    this.setState({ loading: !this.state.loading });
  };

  //頁面重整
  reload = async (clubKey, postKey) => {
    const { getInsidePost, navigation, syncPost, syncPostDelete } = this.props;
    this.postOverLayar();
    const obj = await getInsidePost(clubKey, postKey);
    this.postOverLayar();
    if (obj != null) {
      //貼文同步
      syncPost(obj);
    }
    else {
      //刪除貼文同步
      syncPostDelete(postKey);
      Alert.alert("該貼文不存在！");
      navigation.goBack();
    }
  };

  //設定本頁comment
  setComment = (commentData) => {
    this.setState({ comment: commentData });
  };

  showUser = async (uid) => {
    try {
      this.popupDialog.show(async () => {
        this.setState({ loading: true, userData: { uid: null, user: null, clubs: null } })
        const userData = { uid, user: {}, clubs: {} }
        const user = await getUserData(uid)

        if (user.joinClub) {
          const promises = Object.keys(user.joinClub).map(async (cid) => {
            const club = await getClubData(cid)
            userData.clubs[cid] = club
          })

          await Promise.all(promises)
        }

        userData.user = user

        this.setState({ userData, loading: false })
      });
    } catch (e) {
      Alert.alert(e.toString())
    }
  }

  render() {
    const commentData = this.state.comment
    const element = JSON.parse(JSON.stringify(this.state.post));
    const { uid, user, clubs } = this.state.userData

    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              tintColor='#f6b456'
            />
          }
        >
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.container}>
              <View style={styles.rowLeft}>
                <TouchableOpacity onPress={() => this.showUser(element.poster)}>
                  <View style={styles.circle}>
                    <Image
                      source={{ uri: element.posterPhotoUrl }}
                      //resizeMode="cover"
                      style={styles.bigHead}
                    />
                  </View>
                </TouchableOpacity>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={styles.school}>{element.schoolName}</Text>
                    <Text style={styles.club}>{element.clubName}</Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => { this.refs.advancedPost.open() }}
                        style={{ display: element.statusEnable ? "flex" : "none" }}>
                        <Image
                          style={styles.icon}
                          source={require("../../images/columndots.2.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.name}>{element.posterNickName}</Text>
                    <Text style={styles.job}>{element.posterStatusChinese}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.postView}>
                <Text style={styles.postTitle}>{element.title}</Text>
                <Text style={styles.postDate}>{element.date}</Text>
                <View style={styles.postTextView}>
                  <Text style={styles.postText}>{element.content}</Text>
                </View>
              </View>
              <View style={styles.postPictureView} >
                {
                  Object.keys(element.images).map((child) => (
                    <View key={child}>
                      <Image
                        style={styles.postPicture}
                        source={{ uri: element.images[child] }}
                      />
                      {/* 換行用 */}
                      <Text>  </Text>
                    </View>
                  ))
                }
              </View>
              <View style={styles.sbRowLine}>
                <View style={styles.row}>
                  <TouchableOpacity style={{ flexDirection: 'row' }}
                    onPress={async () =>
                      await this.pressFavorite(element.clubKey, element.postKey)
                    }
                  >
                    <Image
                      style={styles.icon}
                      source={element.statusFavorite
                        ? require("../../images/images2/like-orange.png")
                        : require("../../images/images2/like-gray.png")
                      }
                    />
                    <Text style={[
                      styles.number,
                      { color: element.statusFavorite ? "#f6b456" : "#666666" }
                    ]}>{element.numFavorites} </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <Image
                    style={styles.icon}
                    source={require("../../images/message.png")}
                  />
                  <Text style={styles.number}>{element.numComments}</Text>
                  <Image
                    style={styles.icon}
                    source={
                      element.statusView
                        ? require("../../images/images2/eyes-orange.png")
                        : require("../../images/eyes.png")
                    }
                  />
                  <Text style={[
                    styles.number,
                    { color: element.statusView ? "#f6b456" : "#666666" }
                  ]}>{element.numViews}</Text>
                </View>
              </View>
              <Comment
                comment={commentData}
                clubKey={element.clubKey}
                postKey={element.postKey}
                navigation={this.props.navigation}
                deletingComment={this.props.deletingComment}
                editingComment={this.props.editingComment}
                setComment={this.setComment}
                setCommentFavorite={this.props.setCommentFavorite}
                showUser={this.showUser.bind(this)}
                postOverLayar={this.postOverLayar}
                syncPost={this.props.syncPost}
                syncPostDelete={this.props.syncPostDelete}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={styles.textInput}>
          <CommentInput
            userPhotoUrl={this.props.userPhotoUrl}
            clubKey={element.clubKey}
            postKey={element.postKey}
            navigation={this.props.navigation}
            creatingComment={this.props.creatingComment}
            postOverLayar={this.postOverLayar}
            syncPost={this.props.syncPost}
            syncPostDelete={this.props.syncPostDelete}
          />
        </View>

        {/* 進階貼文 */}
        <Modal style={{ height: 200, justifyContent: 'center', alignItems: 'center' }} position={"bottom"} ref={"advancedPost"}>
          <Button
            buttonStyle={styles.advancedPostBtn}
            title="編輯貼文"
            onPress={() => { 
              this.refs.advancedPost.close();
              this.refs.editPost.open();
            }}
          />
          <Text></Text>
          <Button
            buttonStyle={styles.advancedPostBtn}
            onPress={async () => {
              Alert.alert('確定要刪除貼文嗎？', '', [
                { text: '取消', onPress: () => { } },
                { text: '確定', onPress: async () => await this.deletePost(this.state.post.clubKey, this.state.post.postKey) },
              ]);
            }}
            title="刪除貼文"
          />
        </Modal>

        {/* 編輯貼文 */}
        <Modal style={{ height: 200, justifyContent: 'center', alignItems: 'center' }} position={"center"} ref={"editPost"}>
          <Text>123</Text>
        </Modal>

        <PopupDialog
          ref={(popupDialog) => this.popupDialog = popupDialog}
          dialogAnimation={slideAnimation}
          width={0.7}
          height={0.7}
          dialogStyle={{ borderRadius: 20 }}
        >
          <UserDialog
            uid={uid}
            user={user}
            clubs={clubs}
            loading={this.state.loading}
          />
        </PopupDialog>
        {this.state.loading ? <Overlayer /> : null}
      </View>
    );
  }
}

export default Post;
