//這頁應該是沒啥問題了
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  RefreshControl
} from "react-native";
import { Button } from "react-native-elements";
import Comment from "./Comment";
import styles from "../../styles/post/Post";
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog'

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
      navigation.goBack();
    }
  };

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
      this.postOverLayar();
      navigation.goBack();
    }
  };

  //刪除貼文(未完成)
  deletePost = async (clubKey, postKey) => {
    const { deletingPost, setPostList, postList, navigation } = this.props;
    this.postOverLayar();
    const obj = await deletingPost(clubKey, postKey, postList);
    console.log(obj);
    if (obj != null) {
      if (obj.status == false) {
        alert("該貼文不存在！");
      }
      setPostList(obj.postList);
    }
    this.postOverLayar();
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
              <View style={{ display: element.statusEnable ? "flex" : "none" }}>
                <Button title="編輯貼文" onPress={async () => { }} />
                <Button
                  title="刪除貼文"
                  onPress={async () => {
                    await this.deletePost(element.clubKey, element.postKey);
                  }}
                />
              </View>
            </View>
            <Comment
              userPhotoUrl={this.props.userPhotoUrl}
              comment={commentData}
              clubKey={element.clubKey}
              postKey={element.postKey}
              navigation={this.props.navigation}
              creatingComment={this.props.creatingComment}
              deletingComment={this.props.deletingComment}
              editingComment={this.props.editingComment}
              setCommentEditStatus={this.props.setCommentEditStatus}
              setCommentFavorite={this.props.setCommentFavorite}
              showUser={this.showUser.bind(this)}
              postOverLayar={this.postOverLayar}
              syncPost={this.props.syncPost}
              syncPostDelete={this.props.syncPostDelete}
            />
          </KeyboardAvoidingView>
        </ScrollView>
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
