import React from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import styles from "../../styles/post/Comment";
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
        } = this.props;
        postOverLayar();
        const obj = await creatingComment(clubKey, postKey, content);
        if (obj != null) {
            //放進postList
            const newPostList = JSON.parse(JSON.stringify(postList));
            newPostList[clubKey][postKey] = obj.post;
            setPostList(newPostList);
            //放進post
            setPost(obj.post);
            //放進comment
            setComment(obj.comment);
            //清空輸入欄
            this.setState({ newContent: "" });
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
        } = this.props;
        postOverLayar();
        const obj = await deletingComment(clubKey, postKey, commentKey);
        if (obj != null) {
            //放進postList
            const newPostList = JSON.parse(JSON.stringify(postList));
            newPostList[clubKey][postKey] = obj.post;
            setPostList(newPostList);
            //放進post
            setPost(obj.post);
            //放進comment
            setComment(obj.comment);
        }
        postOverLayar();
    };

    //編輯狀態改變
    statusEditChange = async (element) => {
        const { setComment } = this.props;
        const newComment = JSON.parse(JSON.stringify(this.props.comment));
        newComment[element.commentKey]["statusEdit"] = !newComment[element.commentKey]["statusEdit"];
        //放進comment
        setComment(newComment);
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
        } = this.props;
        postOverLayar();
        const obj = await editingComment(clubKey, postKey, commentKey, content);
        if (obj != null) {
            //放進postList
            const newPostList = JSON.parse(JSON.stringify(postList));
            newPostList[clubKey][postKey] = obj.post;
            setPostList(newPostList);
            //放進post
            setPost(obj.post);
            //放進comment
            setComment(obj.comment);
            this.setState({ oldContent: "" });
        }
        postOverLayar();
    };

    //留言按讚
    pressFavorite = async (clubKey, postKey, commentKey) => {
        const { setCommentFavorite, setPostList, setPost, setComment, postList, postOverLayar } = this.props;
        postOverLayar();
        const obj = await setCommentFavorite(clubKey, postKey, commentKey);
        if (obj != null) {
            //放進postList
            const newPostList = JSON.parse(JSON.stringify(postList));
            newPostList[clubKey][postKey] = obj.post;
            setPostList(newPostList);
            //放進post
            setPost(obj.post);
            //放進comment
            setComment(obj.comment);
        }
        postOverLayar();
    }

    render() {
        const comment = JSON.parse(JSON.stringify(this.props.comment));
        return (
            <View>
                <View>
                    {Object.values(comment).map(element => (
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
                                                    source={require('../../images/like.png')} />
                                            </TouchableOpacity>
                                            <Text style={styles.numberLittle}>{element.numFavorites}</Text>
                                            <TouchableOpacity >
                                                <Image source={require('../../images/pencil.png')}
                                                    style={styles.icon} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text>{element.date}</Text>
                                    <TextInput
                                        style={styles.comment}
                                        value={element.content}
                                        editable={element.statusEdit}
                                        multiline={true}
                                        onChangeText={oldContent => { this.setState({ oldContent }); }}
                                    />
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
                            value={this.state.newContent}
                        />
                    </View>
                    <TouchableOpacity onPress={async () => { await this.addComment(); }}>
                        <Image source={require('../../images/send.png')}
                            style={styles.sendIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Comment;