import React, { Component } from 'react'
import { connect } from 'react-redux'
import Post from '../../components/post/Post'
import {
    setPostFavorite,
    creatingComment,
    deletingComment,
    editingComment,
    setCommentEditStatus,
    getInsidePost,
    deletingPost,
    setCommentFavorite,
    initSetPost,
    initPostToReducer,
} from '../../modules/Post'

class PostPage extends Component {
    render() {
        return (
            <Post
                userPhotoUrl={this.props.userPhotoUrl}
                post={this.props.navigation.state.params.post}
                comment={this.props.navigation.state.params.comment}
                postList={this.props.navigation.state.params.postList}
                setPostList={this.props.navigation.state.params.setPostList}
                getInsidePost={this.props.getInsidePost}
                navigation={this.props.navigation}
                setPostFavorite={this.props.setPostFavorite}
                creatingComment={this.props.creatingComment}
                deletingComment={this.props.deletingComment}
                editingComment={this.props.editingComment}
                setCommentEditStatus={this.props.setCommentEditStatus}
                deletingPost={this.props.deletingPost}
                setCommentFavorite={this.props.setCommentFavorite}
                initSetPost={this.props.initSetPost}
                initPostToReducer={this.props.initPostToReducer}
            />
        )
    }
}

const mapStateToProps = ({ userReducer }) => ({
    userPhotoUrl: userReducer.user.photoURL
})

const mapDispatchToProps = {
    getInsidePost,
    setPostFavorite,
    creatingComment,
    deletingComment,
    editingComment,
    setCommentEditStatus,
    deletingPost,
    setCommentFavorite,
    initSetPost,
    initPostToReducer,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);