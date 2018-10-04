import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Comment from './Comment';

class Post extends React.Component {

    //寫入本地State
    async componentWillMount() {
        this.setState({ post: this.props.post });
    }

    state = {
        post: {}
    }

    reload = async (clubKey, postKey, ) => {
        const { getInsidePost, navigation } = this.props;
        const newPost = await getInsidePost(clubKey, postKey);
        if (newPost == null) {
            navigation.goBack();
        }
        else {
            this.setState({ post: newPost });
        }
    }

    render() {
        const postData = this.state.post;
        const element = JSON.parse(JSON.stringify(postData));
        console.log(element);
        // const newComment = { ...this.props.comment };
        return (
            <ScrollView>
                <KeyboardAvoidingView
                    behavior="padding"
                >
                    <Button
                        title='reload'
                        onPress={async () => { await this.reload(element.clubKey, element.postKey, this.props.router); }}
                    />
                    <View >
                        <Image
                            source={{ uri: element.posterPhotoUrl }}
                            resizeMode='cover'
                            style={{width: 50, height: 50}}
                        />
                        <Text>{element.schoolName}</Text>
                        <Text>{element.clubName}</Text>
                        <Text>{element.posterNickName}</Text>
                        <Text>{element.posterStatusChinese}</Text>
                        <Text>{element.title}</Text>
                        <Text>{element.content}</Text>
                        <Text>{element.date}</Text>
                        <Text>觀看人數: {element.numViews}</Text>
                        <TouchableOpacity onPress={async () => await this.props.setPostFavorite(element.clubKey, element.postKey, true)}>
                            <Text>按讚人數: {element.numFavorites}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Comment
                            comment={newComment}
                            clubKey={newPost[Object.keys(newPost)[0]].clubKey}
                            postKey={newPost[Object.keys(newPost)[0]].postKey}
                            router={this.props.router}
                            creatingComment={this.props.creatingComment}
                            deletingComment={this.props.deletingComment}
                            editingComment={this.props.editingComment}
                            setCommentEditStatus={this.props.setCommentEditStatus}
                        /> */}
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

export default Post;
