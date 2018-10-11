import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Button
} from 'react-native';
import Comment from './Comment';
import styles from "../../styles/post/Post";



class Post extends React.Component {

    state = { //想要預設state就可以這樣宣告一個state把你想要的值放進去
        likeOr: false,
        likeI: require('../../images/like.png'),

        //紘維新增的~
        comment: false,
    }

    changeLikeImg = (index) => {
        let newList = [...this.state.list]
        newList[index].likeOrNo = !newList[index].likeOrNo
        newList[index].likeImg = !newList[index].likeOrNo ? require('../../images/like.png') : require('../../images/graylike.png')
        console.log(newList)
        this.setState({
            list: newList
        })
    }
    //changeLikeI = () => {
    //    this.setState({
    //        likeOr: !this.state.likeOr,
    //        likeI: this.state.likeOr ? require('../../img/like.png') : require('../../img/graylike.png')
    //    })
    //}

    commemt = (status) => {
        this.setState({
            comment: status
        })
    }
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
        changeLikeI = () => {
            this.setState({
                likeOr: !this.state.likeOr,
                likeI: this.state.likeOr ? require('../../images/like.png') : require('../../images/graylike.png')
            })
        }
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
            <View style={styles.container}>
                <ScrollView style={{ width: '100%' }}>
                    <Button
                        title='reload'
                        onPress={async () => { await this.reload(element.clubKey, element.postKey); }}
                    />
                    <View style={styles.rowLeft}>
                        <TouchableOpacity>
                            <Image style={styles.bigHead}
                                source={{ uri: element.posterPhotoUrl }}
                                resizeMode='cover' />
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
                    <View style={styles.postPictureView}>
                        <Image
                            style={styles.postPicture}
                            source={require('../../images/handsomeShownu.jpeg')}
                            resizeMode='cover'
                        />
                    </View>

                    <View style={styles.sbRowLine}>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={async () => await this.pressFavorite(element.clubKey, element.postKey)}>
                                <Image style={styles.icon}
                                    source={this.state.likeI} />
                            </TouchableOpacity>
                            <Text style={styles.number}>{element.numFavorites}</Text>
                        </View>
                        <View style={styles.row}>
                            <Image style={styles.icon}
                                source={require('../../images/message.png')} />
                            <Text style={styles.number}>留言數量</Text>
                            <Image style={styles.icon}
                                source={require('../../images/eyes.png')} />
                            <Text style={styles.number}>{element.numViews}</Text>
                        </View>
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
                </ScrollView>
                <KeyboardAvoidingView behavior='padding'></KeyboardAvoidingView>
            </View>
        );
    }
}
export default Post;