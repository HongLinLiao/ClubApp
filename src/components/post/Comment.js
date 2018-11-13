import React from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView
} from "react-native";
import { Button } from "react-native-elements";
import styles from "../../styles/post/Comment";
import { DatePicker } from "native-base";
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
            setComment,
            postList,
            postOverLayar,
            navigation,
        } = this.props;
        postOverLayar();
        const obj = await creatingComment(clubKey, postKey, content);
        if (obj != null) {
            //放進postList
            let newPostList = postList.slice();
            let result = newPostList.some(function (value, index, array) {
                if (Object.keys(value)[0] == obj.post.postKey) {
                    let newPost = {};
                    newPost[obj.post.postKey] = obj.post
                    newPostList[index] = newPost
                    return true;
                }
                else {
                    return false;
                }
            });
            setPostList(newPostList);
            //放進post
            setPost(obj.post);
            //放進comment
            setComment(obj.comment);
            //清空輸入欄
            this.setState({ newContent: "" });
        }
        else {
            //放進postList
            let newPostList = postList.slice();
            let result = newPostList.some(function (value, index, array) {
                if (Object.keys(value)[0] == postKey) {
                    newPostList.splice(index, 1);
                    alert("該貼文不存在！");
                    return true;
                }
                else {
                    return false;
                }
            });
            setPostList(newPostList);
            navigation.goBack();
        }
        postOverLayar();
    };

    //刪除留言
    deleteComment = async (commentKey) => {
        const {
            deletingComment,
            clubKey,
            postKey,
            setPostList,
            setPost,
            setComment,
            postList,
            postOverLayar,
            navigation
        } = this.props;
        postOverLayar();
        const obj = await deletingComment(clubKey, postKey, commentKey);
        if (obj != null) {
            //放進postList
            let newPostList = postList.slice();
            let result = newPostList.some(function (value, index, array) {
                if (Object.keys(value)[0] == obj.post.postKey) {
                    let newPost = {};
                    newPost[obj.post.postKey] = obj.post
                    newPostList[index] = newPost
                    return true;
                }
                else {
                    return false;
                }
            });
            setPostList(newPostList);
            //放進post
            setPost(obj.post);
            //放進comment
            setComment(obj.comment);
            //清空輸入欄
            this.setState({ newContent: "" });
        }
        else {
            //放進postList
            let newPostList = postList.slice();
            let result = newPostList.some(function (value, index, array) {
                if (Object.keys(value)[0] == postKey) {
                    newPostList.splice(index, 1);
                    alert("該貼文不存在！");
                    return true;
                }
                else {
                    return false;
                }
            });
            setPostList(newPostList);
            navigation.goBack();
        }
        postOverLayar();
    };

    //編輯狀態改變
    statusEditChange = async (element) => {
        const { setComment } = this.props;
        let newCommentList = this.props.comment.slice();
        let result = newCommentList.some(function (value, index, array) {
            if (Object.keys(value)[0] == element.commentKey) {
                newCommentList[index][element.commentKey].statusEdit = !newCommentList[index][element.commentKey].statusEdit;
                return true;
            }
            else {
                return false;
            }
        });
        //放進comment
        setComment(newCommentList);
        this.setState({
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
            setComment,
            postList,
            postOverLayar,
            navigation
        } = this.props;
        postOverLayar();
        const obj = await editingComment(clubKey, postKey, commentKey, content);
        if (obj != null) {
            //放進postList
            let newPostList = postList.slice();
            let result = newPostList.some(function (value, index, array) {
                if (Object.keys(value)[0] == obj.post.postKey) {
                    let newPost = {};
                    newPost[obj.post.postKey] = obj.post
                    newPostList[index] = newPost
                    return true;
                }
                else {
                    return false;
                }
            });
            setPostList(newPostList);
            //放進post
            setPost(obj.post);
            //放進comment
            setComment(obj.comment);
            //清空輸入欄
            this.setState({ newContent: "" });
        }
        else {
            //放進postList
            let newPostList = postList.slice();
            let result = newPostList.some(function (value, index, array) {
                if (Object.keys(value)[0] == postKey) {
                    newPostList.splice(index, 1);
                    alert("該貼文不存在！");
                    return true;
                }
                else {
                    return false;
                }
            });
            setPostList(newPostList);
            navigation.goBack();
        }
        postOverLayar();
    };

    //留言按讚
    pressFavorite = async (clubKey, postKey, commentKey) => {
        const {
            setCommentFavorite,
            setPostList,
            setPost,
            setComment,
            postList,
            postOverLayar,
            navigation } = this.props;
        postOverLayar();
        const obj = await setCommentFavorite(clubKey, postKey, commentKey);
        if (obj != null) {
            //放進postList
            let newPostList = postList.slice();
            let result = newPostList.some(function (value, index, array) {
                if (Object.keys(value)[0] == obj.post.postKey) {
                    let newPost = {};
                    newPost[obj.post.postKey] = obj.post
                    newPostList[index] = newPost
                    return true;
                }
                else {
                    return false;
                }
            });
            setPostList(newPostList);
            //放進post
            setPost(obj.post);
            //放進comment
            setComment(obj.comment);
            //清空輸入欄
            this.setState({ newContent: "" });
        }
        else {
            //放進postList
            let newPostList = postList.slice();
            let result = newPostList.some(function (value, index, array) {
                if (Object.keys(value)[0] == postKey) {
                    newPostList.splice(index, 1);
                    alert("該貼文不存在！");
                    return true;
                }
                else {
                    return false;
                }
            });
            setPostList(newPostList);
            navigation.goBack();
        }
        postOverLayar();
    }

    render() {
        const commentData = this.props.comment;
        const comment = commentData.slice();
        return (
            <View>
                <View>
                    {comment.map(obj => (
                        Object.values(obj).map((element) => (
                            <View key={element.commentKey}>
                                <View style={styles.rowPadding}>
                                    <TouchableOpacity onPress={() => this.props.showUser(element.commenter)}>
                                        <View style={styles.littleCircle}>
                                            <Image style={styles.littleHead}
                                                source={{ uri: element.commenterPhotoUrl }}
                                                resizeMode="cover" />
                                        </View>
                                    </TouchableOpacity>

                                    <View style={styles.columnLine}>
                                        <View style={styles.sbRow}>
                                            <View style={styles.row}>
                                                <Text style={styles.littleName}>{element.commenterNickName}</Text>
                                            </View>
                                            <View style={styles.row}>
                                                <TouchableOpacity onPress={async () =>
                                                    await this.pressFavorite(element.clubKey, element.postKey, element.commentKey)
                                                }>
                                                    <Image style={styles.icon}
                                                        source={
                                                            element.statusFavorite//已可判斷
                                                                ? require("../../images/images2/like-orange.png")
                                                                : require("../../images/images2/like-gray.png")
                                                        } />
                                                </TouchableOpacity>
                                                <Text style={[styles.numberLittle,
                                                {
                                                    color: element.statusFavorite //已可判斷
                                                        ? "#f6b456" : "#666666"
                                                }]}>{element.numFavorites}</Text>
                                                <TouchableOpacity style={{ display: element.statusEnable ? "flex" : "none" }}>
                                                    <Image source={require('../../images/pencil.png')}
                                                        style={styles.icon} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text style={styles.littleName}>{element.date}</Text>
                                        <View style={{ flex: 1 }}>
                                            <TextInput
                                                style={styles.comment}
                                                value={element.content}
                                                editable={element.statusEdit}
                                                multiline={true}
                                                onChangeText={oldContent => { this.setState({ oldContent }); }}
                                            />
                                        </View>

                                    </View>
                                </View>

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
                        ))
                    ))}
                </View>
                <View style={styles.rowPaddingInput}>
                    <View style={styles.littleCircle}>
                        <Image
                            style={styles.littleHead}
                            source={{ uri: this.props.userPhotoUrl }}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.inputViewTabBar}>

                        <TextInput
                            style={styles.textInputTabBar}
                            placeholder='新增留言...'
                            placeholderTextColor='rgba(102,102,102,0.7)'
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                            onChangeText={newContent => { this.setState({ newContent }); }}
                            onContentSizeChange={event => { this.setState({ height: event.nativeEvent.contentSize.height }); }}
                        />

                    </View>
                    <TouchableOpacity onPress={async () => { await this.addComment(); }}>
                        <Image source={require('../../images/send.png')}
                            style={styles.sendIcon} />
                    </TouchableOpacity>
                    <KeyboardAvoidingView behavior='padding' enabled> </KeyboardAvoidingView>
                </View>

            </View>

        );
    }
}

export default Comment;