import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import Comment from './Comment';

class Post extends React.Component {

    reload = async (clubKey,postKey,router) => {
        const { getInsidePost , navigation } = this.props;
        const newPost = await getInsidePost(clubKey,postKey,router); 
        console.log(newPost);
        if(newPost==undefined){
            alert('Post is not exist!');
            navigation.goBack();
        }
    }

    render() {
        const newPost = { ...this.props.post };
        const newComment = { ...this.props.comment };
        return (
            Object.values(newPost).map((element) => (
                <ScrollView
                    key={element.postKey}
                >
                    <KeyboardAvoidingView
                        behavior="padding"
                    >
                        <Button
                            title='reload'
                            onPress={async () => { await this.reload(element.clubKey,element.postKey,this.props.router); }}
                        />
                        <View >
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
                        <Comment
                            comment={newComment}
                            clubKey={newPost[Object.keys(newPost)[0]].clubKey}
                            postKey={newPost[Object.keys(newPost)[0]].postKey}
                            router={this.props.router}
                            creatingComment={this.props.creatingComment}
                            deletingComment={this.props.deletingComment}
                            editingComment={this.props.editingComment}
                            setCommentEditStatus={this.props.setCommentEditStatus}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
            ))
        )
    }
}

export default Post;
