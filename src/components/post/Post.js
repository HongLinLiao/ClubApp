import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import { Button } from "react-native-elements";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import styles from "../../styles/post/Post";
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog';
import Modal from 'react-native-modalbox';
import { takePhoto, selectPhoto } from '../../modules/Common'
import UserListDialog from '../common/UserListDialog'

const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});
class Post extends React.Component {
  //寫入本地State
  componentWillMount() {
    const { initSetPost, navigation, initPostToReducer, syncPost } = this.props;
    initSetPost((obj) => { this.setState({ post: obj.post, comment: obj.comment }); }, navigation);
    initPostToReducer({ post: this.props.post, comment: this.props.comment }, navigation);
    //貼文同步
    syncPost({ post: this.props.post, comment: this.props.comment });
    this.setState({ post: this.props.post, comment: this.props.comment, editImg: this.props.post.images });
  }

  state = {
    post: {},
    comment: [],
    userData: { uid: null, user: null, clubs: null },
    userList: { keyList: {}, dataList: [], classification: '' },
    loading: false,//貼文過門
    editPostLoading: false,//編輯貼文過門
    editCommentLoading: false,//編輯留言過門,
    editTitle: '',//編輯標題
    editTitleStatus: false,//編輯標題狀態
    editContent: '',//編輯內容
    editContentStatus: false,//編輯內容狀態
    editImg: [],//編輯圖片(預設為原始資料)
    editImgStatus: false,//編輯圖片狀態
    newImg: [],//新增照片
    newImgStatus: false,//新增照片狀態
    advancedComment: {},//進階留言
    tempInput: '',//編輯留言暫存
    refreshing: false,//重整
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
      await syncPostDelete(postKey);
      const syncPostBack = navigation.state.params.syncPostBack;
      const routeName = navigation.state.routeName;
      await syncPostBack(routeName);
      Alert.alert("該貼文不存在！");
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
      const syncPostBack = navigation.state.params.syncPostBack;
      const routeName = navigation.state.routeName;
      await syncPostBack(routeName);
      Alert.alert("該貼文不存在！");
      this.postOverLayar();
      navigation.goBack();
    }
  };

  //編輯貼文
  editPost = async (clubKey, postKey) => {
    const { editingPost, navigation, syncPostDelete, syncPost } = this.props;

    let status = true;
    if (this.state.editTitleStatus == false
      && this.state.editContentStatus == false
      && this.state.editImgStatus == false
      && this.state.newImgStatus == false
    ) {
      status = false;
    }
    else {
      if (this.state.editTitleStatus == true && this.state.editTitle == '') {
        status = false;
      }
      else if (this.state.editContentStatus == true && this.state.editContent == '') {
        status = false;
      }
    }
    if (status) {
      this.editPostOverLayar();
      let newData = {};
      if (this.state.editTitleStatus) {
        newData.title = this.state.editTitle;
      }
      if (this.state.editContentStatus) {
        newData.content = this.state.editContent;
      }
      //如果有新增照片，則舊的也要傳進去一起更新(陣列的壞處)
      if (this.state.newImgStatus) {
        newData.newImages = this.state.newImg;
        if (this.state.editImgStatus) {
          newData.images = this.state.editImg;
        }
        else {
          newData.images = this.props.post.images;
        }
      }
      else {
        if (this.state.editImgStatus) {
          newData.images = this.state.editImg;
        }
      }
      const obj = await editingPost(clubKey, postKey, newData);
      if (obj != null) {
        //貼文同步
        await syncPost(obj);
        this.setState({
          editTitle: '',
          editTitleStatus: false,
          editContent: '',
          editContentStatus: false,
          editImg: obj.post.images,
          editImgStatus: false,
          newImg: [],
          newImgStatus: false,
        })
        this.editPostOverLayar();
        this.refs.editPost.close();
      }
      else {
        //刪除貼文同步
        await syncPostDelete(postKey);
        const syncPostBack = navigation.state.params.syncPostBack;
        const routeName = navigation.state.routeName;
        await syncPostBack(routeName);
        Alert.alert("該貼文不存在！");
        this.editPostOverLayar();
        this.refs.editPost.close();
        navigation.goBack();
      }
    }
    else {
      Alert.alert('請輸入新內容！');
    }
  }

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
    const syncPostBack = navigation.state.params.syncPostBack;
    const routeName = navigation.state.routeName;
    await syncPostBack(routeName);
    navigation.goBack();
  };

  //編輯留言
  editComment = async (clubKey, postKey, commentKey) => {
    const content = this.state.tempInput;
    const {
      editingComment,
      navigation,
      syncPost,
      syncPostDelete
    } = this.props;
    this.editCommentOverLayar();
    const obj = await editingComment(clubKey, postKey, commentKey, content);
    if (obj != null) {
      //貼文同步
      syncPost(obj);
      this.editCommentOverLayar();
      this.editCommentDialog.dismiss();
    }
    else {
      //刪除貼文同步
      syncPostDelete(postKey);
      const syncPostBack = navigation.state.params.syncPostBack;
      const routeName = navigation.state.routeName;
      await syncPostBack(routeName);
      Alert.alert("該貼文不存在！");
      this.editCommentOverLayar();
      this.editCommentDialog.dismiss();
      navigation.goBack();
    }
  };

  //刪除留言
  deleteComment = async (clubKey, postKey, commentKey) => {
    const {
      deletingComment,
      navigation,
      syncPost,
      syncPostDelete,
    } = this.props;
    this.postOverLayar();
    const obj = await deletingComment(clubKey, postKey, commentKey);
    if (obj != null) {
      //貼文同步
      syncPost(obj);
      this.postOverLayar();
    }
    else {
      //刪除貼文同步
      syncPostDelete(postKey);
      const syncPostBack = navigation.state.params.syncPostBack;
      const routeName = navigation.state.routeName;
      await syncPostBack(routeName);
      Alert.alert("該貼文不存在！");
      this.postOverLayar();
      navigation.goBack();
    }
  };

  //開啟相機
  handleTakePhoto = async () => {
    try {
      const url = await takePhoto()
      if (url) {
        const imagesList = [...this.state.newImg]
        imagesList.push(url)
        this.setState({
          newImg: imagesList,
          newImgStatus: true
        })
      } else {
        Alert.alert('取消')
      }
    } catch (e) {
      console.log(e)
      Alert.alert('發生錯誤')
    }
  }

  //開啟相簿
  handleSelectPhoto = async () => {
    try {
      const url = await selectPhoto()
      if (url) {
        const imagesList = [...this.state.newImg]
        imagesList.push(url)
        this.setState({
          newImg: imagesList,
          newImgStatus: true
        })
      } else {
        Alert.alert('取消')
      }
    } catch (e) {
      console.log(e)
      Alert.alert('發生錯誤')
    }
  }

  //過門
  postOverLayar = () => {
    this.setState({ loading: !this.state.loading });
  };

  editPostOverLayar = () => {
    this.setState({ editPostLoading: !this.state.editPostLoading });
  }

  editCommentOverLayar = () => {
    this.setState({ editCommentLoading: !this.state.editCommentLoading });
  }

  //顯示user資訊
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

  //顯示userList
  showUserList = async (userList, classification) => {
    try {
      this.userList.show(async () => {
        this.setState({ loading: true, userList: { keyList: userList, dataList: [], classification: '' } })

        let userData = [];
        let userKeyList = Object.keys(userList);
        if (userKeyList.length > 0) {
          for (let i = 0; i < userKeyList.length; i++) {
            let uid = userKeyList[i];
            let user = await getUserData(uid);
            if (user) {
              let obj = {};
              obj.nickName = user.nickName;
              obj.photoUrl = user.photoUrl;
              obj.uid = uid;
              userData.push(obj);
            }
          }
        }
        this.setState({ userList: { keyList: userList, dataList: userData, classification: classification }, loading: false })
      });
    } catch (error) {
      Alert.alert(error.toString())
    }
  }

  //顯示留言進階選項
  showAdvancedComment = (obj) => {
    try {
      this.advancedComment.show(() => {
        //重置
        this.setState({ advancedComment: obj });
      });
    }
    catch (e) {
      Alert.alert(e.toString())
    }
  }

  render() {
    const commentData = this.state.comment
    const element = JSON.parse(JSON.stringify(this.state.post));
    const { uid, user, clubs } = this.state.userData;
    const { keyList, dataList, classification } = this.state.userList;


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

              <View style={[styles.row2, { padding: 8 }]}>
                <TouchableOpacity
                  onPress={() => { this.refs.advancedPost.open() }}
                  style={{ display: element.editStatus || element.deleteStatus ? "flex" : "none" }}>

                  <Image
                    style={styles.icon}
                    source={require("../../images/more.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.postView}>
              <Text style={styles.postTitle}>{element.title}</Text>
              <Text style={styles.postDate}>{element.date}</Text>
              <View style={styles.postTextView}>
                <Text style={styles.postText}>{element.content}</Text>
              </View>
            </View>
            <View styles={styles.postPictureView}>
              <ScrollView horizontal>
                {
                  element.images.map((value, index) => (
                    <View key={index}>
                      <Image
                        style={styles.postPicture}
                        source={{ uri: element.images[index] }}
                      />
                    </View>
                  ))
                }
              </ScrollView>
            </View>
            <View style={[styles.sbRowLine, { marginTop: 20 }]}>
              <View style={[styles.row,]}>
                <TouchableOpacity style={{ flexDirection: 'row' }}
                  onLongPress={() => { this.showUserList(element.favorites, 'favorites'); }}
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

              <View style={[styles.row, { justifyContent: 'flex-end' }]}>
                <Image
                  style={styles.icon}
                  source={require("../../images/message.png")}
                />
                <Text style={styles.number}>{element.numComments}</Text>
                <TouchableOpacity onLongPress={() => { this.showUserList(element.views, 'views'); }}
                  onPress={() => { this.showUserList(element.views, 'views'); }}>
                  <Image
                    style={styles.icon}
                    source={
                      element.statusView
                        ? require("../../images/images2/eyes-orange.png")
                        : require("../../images/eyes.png")
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onLongPress={() => { this.showUserList(element.views, 'views'); }}
                  onPress={() => { this.showUserList(element.views, 'views'); }}>
                  <Text style={[
                    styles.number,
                    { color: element.statusView ? "#f6b456" : "#666666" }
                  ]}>{element.numViews}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Comment
              comment={commentData}
              clubKey={element.clubKey}
              postKey={element.postKey}
              navigation={this.props.navigation}
              setCommentFavorite={this.props.setCommentFavorite}
              showUser={this.showUser.bind(this)}
              showUserList={this.showUserList.bind(this)}
              showAdvancedComment={this.showAdvancedComment.bind(this)}
              postOverLayar={this.postOverLayar}
              syncPost={this.props.syncPost}
              syncPostDelete={this.props.syncPostDelete}
            />
          </View>
          <View style={{ height: 70 }}>
            <Text>  </Text>
          </View>
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
            buttonStyle={[styles.advancedPostBtn, { display: element.editStatus ? 'flex' : 'none' }]}
            title="編輯貼文"
            onPress={() => {
              this.refs.advancedPost.close();
              this.refs.editPost.open();
            }}
          />
          <Text></Text>
          <Button
            buttonStyle={[styles.advancedPostBtn, { display: element.deleteStatus ? 'flex' : 'none' }]}
            onPress={async () => {
              Alert.alert('確定要刪除貼文嗎？', '', [
                { text: '取消', onPress: () => { } },
                {
                  text: '確定', onPress: async () => {
                    this.refs.advancedPost.close();
                    await this.deletePost(this.state.post.clubKey, this.state.post.postKey)
                  }
                },
              ]);
            }}
            title="刪除貼文"
          />
        </Modal>

        {/* 編輯貼文 */}
        <Modal backdropPressToClose={false} swipeToClose={false}
          style={{ height: 550 }} position={"center"} ref={"editPost"}>
          <ScrollView>
            <View>
              <View style={[styles.rowLeft, { height: 100 }]}>
                <View style={styles.circle}>
                  <Image
                    source={{ uri: element.posterPhotoUrl }}
                    //resizeMode="cover"
                    style={styles.bigHead}
                  />
                </View>
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
              <ScrollView horizontal>
                <View style={{ flexDirection: 'row' }}>
                  {
                    //原始照片(刪除用)
                    this.state.editImg.map((uri, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('刪除照片', '', [
                            { text: '取消', onPress: () => { } },
                            {
                              text: '確定刪除', onPress: () => {
                                let temp = this.state.editImg.slice();
                                temp.splice(index, 1);
                                this.setState({ editImg: temp, editImgStatus: true })
                              }
                            },
                          ]);
                        }}
                        key={index}>
                        <Image
                          style={{ height: 100, width: 100 }}
                          source={{ uri }}
                        />
                      </TouchableOpacity>
                    ))
                  }
                  {
                    //新增照片
                    this.state.newImg.map((uri, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('刪除照片', '', [
                            { text: '取消', onPress: () => { } },
                            {
                              text: '確定刪除', onPress: () => {
                                let temp = this.state.editImg.slice();
                                temp.splice(index, 1);
                                this.setState({ editImg: temp, editImgStatus: true })
                              }
                            },
                          ]);
                        }}
                        key={index}>
                        <Image
                          style={{ height: 100, width: 100 }}
                          source={{ uri }}
                        />
                      </TouchableOpacity>
                    ))
                  }
                  {/* 轉黑色照片 */}
                  <TouchableOpacity
                    onPress={async () => {
                      Alert.alert('選取照片', '', [
                        { text: '相機', onPress: async () => { await this.handleTakePhoto(); } },
                        { text: '相簿', onPress: async () => { await this.handleSelectPhoto(); } },
                        { text: '取消', onPress: () => { } }
                      ]);
                    }}
                  >
                    <Image
                      style={{ height: 50, width: 50, margin: 25 }}
                      source={require('../../images/plus-button-gray.png')}
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <View style={styles.postView}>
                <TextInput
                  defaultValue={element.title}
                  style={styles.editPostTitleInput}
                  underlineColorAndroid={'transparent'}
                  onChangeText={(content) => this.setState({ editTitle: content, editTitleStatus: true })}
                />
                <TextInput
                  defaultValue={element.content}
                  style={styles.editPostContentInput}
                  underlineColorAndroid={'transparent'}
                  multiline={true}
                  onChangeText={(content) => this.setState({ editContent: content, editContentStatus: true })}
                />
              </View>
            </View>
          </ScrollView>
          <View style={[styles.textInput, { bottom: 10 }]}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <Button
                onPress={() => {
                  this.setState({
                    editTitle: '',//編輯標題
                    editTitleStatus: false,//編輯標題狀態
                    editContent: '',//編輯內容
                    editContentStatus: false,//編輯內容狀態
                    editImg: this.props.post.images,//編輯圖片(預設為原始資料)
                    editImgStatus: false,
                    newImg: [],//新增圖片
                    newImgStatus: false,//新增圖片狀態
                  })
                  this.refs.editPost.close();
                }}
                buttonStyle={styles.editPostbtn}
                title="取消"
                titleStyle={styles.editPostbtnTxt}
              />
              <Button
                onPress={async () => {
                  Alert.alert('確定要修改貼文嗎？', '', [
                    { text: '取消', onPress: () => { } },
                    { text: '確定', onPress: async () => await this.editPost(element.clubKey, element.postKey) },
                  ]);
                }}
                buttonStyle={styles.editPostbtn}
                title="確定"
                titleStyle={styles.editPostbtnTxt}
              />
            </View>
          </View>
          {this.state.editPostLoading ? <Overlayer /> : null}
        </Modal>

        {/* 顯示user資料 */}
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

        {/* 留言進階功能 */}
        <PopupDialog
          ref={(advancedComment) => this.advancedComment = advancedComment}
          dialogAnimation={slideAnimation}
          width={0.8}
          height={0.2}
          dialogStyle={{ borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
        >
          <Button
            buttonStyle={[styles.advancedPostBtn, { display: this.state.advancedComment.editStatus ? 'flex' : 'none' }]}
            title="編輯留言"
            onPress={() => {
              this.advancedComment.dismiss();
              this.editCommentDialog.show();
            }}
          />
          <Button
            buttonStyle={[styles.advancedPostBtn, { marginTop: 15, display: this.state.advancedComment.deleteStatus ? 'flex' : 'none' }]}
            onPress={async () => {
              Alert.alert('確定要刪除留言嗎？', '', [
                { text: '取消', onPress: () => { } },
                {
                  text: '確定', onPress: async () => {
                    this.advancedComment.dismiss();
                    await this.deleteComment(
                      this.state.advancedComment.clubKey,
                      this.state.advancedComment.postKey,
                      this.state.advancedComment.commentKey,
                    )
                  }
                },
              ]);
            }}
            title="刪除留言"
          />
        </PopupDialog>

        {/* 留言編輯功能 */}
        <PopupDialog
          ref={(editCommentDialog) => this.editCommentDialog = editCommentDialog}
          dialogAnimation={slideAnimation}
          width={0.8}
          height={0.4}
          dialogStyle={{ borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ width: 200 }}>
            <View style={{ height: 200, backgroundColor: '#FFDDAA', borderRadius: 20 }}>
              <TextInput
                ref={(editCommentContent) => { this.editCommentContent = editCommentContent }}
                underlineColorAndroid={'transparent'}
                onChangeText={tempInput => { this.setState({ tempInput }); }}
                defaultValue={this.state.advancedComment.content}
                multiline={true}
                style={styles.editCommentInput}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-around' }}>
              <Button
                title={'取消'}
                buttonStyle={styles.editCommentbtn}
                onPress={() => {
                  this.editCommentDialog.dismiss();
                  this.setState({ tempInput: '' });
                }}
                titleStyle={{ fontSize: 15 }}
              />
              <Button
                title={'確定'}
                buttonStyle={styles.editCommentbtn}
                titleStyle={{ fontSize: 15 }}
                onPress={async () => {
                  await this.editComment(this.state.advancedComment.clubKey, this.state.advancedComment.postKey, this.state.advancedComment.commentKey);
                }}
              />
            </View>
          </View>
          {this.state.editCommentLoading ? <Overlayer /> : null}
        </PopupDialog>

        {/* user列表 */}
        <PopupDialog
          ref={(userList) => this.userList = userList}
          dialogAnimation={slideAnimation}
          width={0.75}
          height={0.7}
          dialogStyle={{ borderRadius: 20 }}
        >
          <UserListDialog
            keyList={keyList}
            dataList={dataList}
            loading={this.state.loading}
            showUser={this.showUser.bind(this)}
            closeList={() => { this.userList.dismiss(); }}
            classification={classification}
          />
        </PopupDialog>
        {this.state.loading ? <Overlayer /> : null}
      </View >

    );

  }
}


export default Post;