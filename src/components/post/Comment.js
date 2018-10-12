import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
import styles from "../../styles/club/Post";
class Comment extends React.Component {

  state = {
    //更新
    oldContent: "",
    //新增
    newContent: "",
    height: 0
  };

  //新增留言
  addComment = async () => {
    const content = this.state.newContent;
    const {
      clubKey,
      postKey,
      creatingComment,
      setPostList,
      setPost,
      setComment
    } = this.props;
    const obj = await creatingComment(clubKey, postKey, content);
    if (obj != null) {
      //放進postList
      setPostList(obj.postList);
      //放進post
      setPost(obj.postList[clubKey][postKey]);
      //放進comment
      setComment(obj.comment);
      //清空輸入欄
      this.setState({ newContent: "" });
    }
  };

  //刪除留言
  deleteComment = async (commentKey) => {
    const {
      deletingComment,
      clubKey,
      postKey,
      setPostList,
      setPost,
      setComment
    } = this.props;
    const obj = await deletingComment(clubKey, postKey, commentKey);
    if (obj != null) {
      //放進postList
      setPostList(obj.postList);
      //放進post
      setPost(obj.postList[clubKey][postKey]);
      //放進comment
      setComment(obj.comment);
    }
  };

  //編輯狀態改變
  statusEditChange = async (element) => {
    const newComment = JSON.parse(JSON.stringify(this.state.comment));
    newComment[element.commentKey]["statusEdit"] = !newComment[element.commentKey]["statusEdit"];
    this.setState({
      comment: newComment,
      oldContent: ""
    });
  };

  //編輯留言完成
  editComment = async (commentKey) => {
    const content = this.state.oldContent;
    const {
      editingComment,
      clubKey,
      postKey,
      setPostList,
      setPost,
      setComment
    } = this.props;
    const obj = await editingComment(clubKey, postKey, commentKey, content);
    if (obj != null) {
      //放進postList
      setPostList(obj.postList);
      //放進post
      setPost(obj.postList[clubKey][postKey]);
      //放進comment
      setComment(obj.comment);
      this.setState({ oldContent: "" });
    }
  };

  render() {
    const comment = JSON.parse(JSON.stringify(this.props.comment));
    return (
      <View>
        <View>
          {Object.values(comment).map(element => (
            <View key={element.commentKey}>
              <Image
                source={{ uri: element.commenterPhotoUrl }}
                resizeMode="cover"
                style={{ width: 50, height: 50 }}
              />
              <Text>{element.commenterNickName}</Text>
              <Text>按讚人數：{element.numFavorites}</Text>
              <TextInput
                value={element.content}
                editable={element.statusEdit}
                onChangeText={oldContent => {
                  this.setState({ oldContent });
                }}
              />
              <Text>{element.date}</Text>
              <View style={{ display: element.statusEnable ? "flex" : "none" }}>
                <Button
                  style={{ display: element.statusEdit ? "flex" : "none" }}
                  title="完成"
                  onPress={async () =>
                    await this.editComment(element.commentKey)
                  }
                />
                <Button
                  style={{ display: element.statusEdit ? "flex" : "none" }}
                  title="取消"
                  onPress={() => this.statusEditChange(element)}
                />
                <Button
                  disabled={
                    element.statusEnable
                      ? element.statusEdit
                        ? element.statusEdit
                        : element.statusEdit
                      : !element.statusEnable
                  }
                  title="編輯留言"
                  onPress={() => this.statusEditChange(element)}
                />
                <Button
                  disabled={
                    element.statusEnable
                      ? element.statusEdit
                        ? element.statusEdit
                        : element.statusEdit
                      : !element.statusEnable
                  }
                  title="刪除留言"
                  onPress={async () => {
                    await this.deleteComment(element.commentKey);
                  }}
                />
              </View>
            </View>
          ))}
        </View>
        <View>
          <TextInput
            style={{
              borderColor: "black",
              borderWidth: 2,
              height: Math.max(30, this.state.height)
            }}
            multiline={true}
            placeholder="留言"
            onChangeText={newContent => {
              this.setState({ newContent });
            }}
            onContentSizeChange={event => {
              this.setState({ height: event.nativeEvent.contentSize.height });
            }}
            value={this.state.newContent}
          />
          <Button
            title="發送留言"
            onPress={async () => {
              await this.addComment();
            }}
          />
        </View>
      </View>
    );
  }
}

export default Comment;
