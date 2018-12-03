import React from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Button } from "react-native-elements";
import styles from "../../styles/post/Comment";
import Modal from 'react-native-modalbox';

class Comment extends React.Component {

    //留言按讚
    pressFavorite = async (clubKey, postKey, commentKey) => {
        const {
            setCommentFavorite,
            postOverLayar,
            syncPost,
            syncPostDelete,
            navigation,
        } = this.props;
        postOverLayar();
        const obj = await setCommentFavorite(clubKey, postKey, commentKey);
        if (obj != null) {
            //貼文同步
            syncPost(obj);
            postOverLayar();
        }
        else {
            //刪除貼文同步
            syncPostDelete(postKey);
            Alert.alert("該貼文不存在！");
            postOverLayar();
            navigation.goBack();
        }
    }

    render() {
        const commentData = this.props.comment;
        const comment = commentData.slice();
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
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
                                            <TouchableOpacity style={{ flexDirection: 'row' }}
                                                onPress={async () =>
                                                    await this.pressFavorite(element.clubKey, element.postKey, element.commentKey)
                                                }>
                                                <Image style={styles.icon}
                                                    source={
                                                        element.statusFavorite//已可判斷
                                                            ? require("../../images/images2/like-orange.png")
                                                            : require("../../images/images2/like-gray.png")
                                                    } />
                                                <Text style={[styles.numberLittle,
                                                {
                                                    color: element.statusFavorite //已可判斷
                                                        ? "#f6b456" : "#666666"
                                                }]}>
                                                    {element.numFavorites}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                this.props.showAdvancedComment({
                                                    editStatus: element.editStatus,
                                                    deleteStatus: element.deleteStatus,
                                                    clubKey: element.clubKey,
                                                    postKey: element.postKey,
                                                    commentKey: element.commentKey,
                                                    content: element.content
                                                });
                                            }}
                                                style={{ display: element.editStatus || element.deleteStatus ? "flex" : "none" }}>
                                                <Image source={require('../../images/pencil.png')}
                                                    style={styles.icon} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={[styles.contentView, { flex: 1 }]}>
                                        <Text style={styles.littleName}>{element.date}</Text>
                                    </View>
                                    <View style={[styles.contentView, { flex: 1 }]}>
                                        <Text style={styles.contentText}>{element.content}</Text>
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
                            </View>
                        </View>
                    ))
                ))}
            </View>
        );
    }
}

export default Comment;