import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Comment from './Comment';

class Post extends React.Component {

    //寫入本地State
    async componentWillMount() {
        this.setState({ post: this.props.post, comment: this.props.comment });
    }

    state = {
        post: {},
        comment: {},
    }

    //頁面重整
    reload = async (clubKey, postKey) => {
        const { getInsidePost, navigation } = this.props;
        const newPost = await getInsidePost(clubKey, postKey);
        if (newPost == null) {
            navigation.goBack();
        }
        else {
            this.setState({ post: newPost });
        }
    }

    //點讚
    pressFavorite = async (clubKey, postKey) => {
        const { setPostFavorite, postList, setPostList } = this.props;
        const postData = await setPostFavorite(clubKey, postKey);
        if (postData != null) {
            //放進postList
            const newPostList = JSON.parse(JSON.stringify(postList));
            newPostList[postData.clubKey][postData.postKey] = postData;
            setPostList(newPostList);
            this.setState({ post: postData });
        }
    }

    //設定本頁post
    setPost = (postData) => {
        this.setState({ post: postData });
    }

    deletePost = async (clubKey, postKey) => {
        const { deletePostData, setPostList, postList, navigation } = this.props;
        const newPostList = await deletePostData(clubKey, postKey, postList);
        setPostList(newPostList);
        navigation.goBack();
    }

    render() {
        const postData = this.state.post;
        const commentData = this.props.comment;
        const element = JSON.parse(JSON.stringify(postData));

        return (
            <ScrollView>
                <KeyboardAvoidingView
                    behavior="padding"
                >
                    <Button
                        title='reload'
                        onPress={async () => { await this.reload(element.clubKey, element.postKey); }}
                    />
                    <View >
                        <Image
                            source={{ uri: element.posterPhotoUrl }}
                            resizeMode='cover'
                            style={{ width: 50, height: 50 }}
                        />
                        <Text>{element.schoolName}</Text>
                        <Text>{element.clubName}</Text>
                        <Text>{element.posterNickName}</Text>
                        <Text>{element.posterStatusChinese}</Text>
                        <Text>{element.title}</Text>
                        <Text>{element.content}</Text>
                        <Text>{element.date}</Text>
                        <Text>觀看人數: {element.numViews}</Text>
                        <TouchableOpacity onPress={async () => await this.pressFavorite(element.clubKey, element.postKey)}>
                            <Text>按讚人數: {element.numFavorites}</Text>
                        </TouchableOpacity>
                    </View>
                    <Button
                        title='Delete Post'
                        onPress={async () => { await this.deletePost(element.clubKey, element.postKey); }}
                    />
                    <Comment
                        comment={commentData}
                        clubKey={element.clubKey}
                        postKey={element.postKey}
                        setPostList={this.props.setPostList}
                        setPost={this.setPost}
                        creatingComment={this.props.creatingComment}
                        deletingComment={this.props.deletingComment}
                        editingComment={this.props.editingComment}
                        setCommentEditStatus={this.props.setCommentEditStatus}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

export default Post;
