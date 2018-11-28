import React, { Component } from 'react'
import { connect } from 'react-redux'
import Post from '../../components/post/Post'
import {
    setPostFavorite,
    creatingComment,
    deletingComment,
    editingComment,
    getInsidePost,
    deletingPost,
    setCommentFavorite,
    initSetPost,
    initPostToReducer,
    syncPost,
    syncPostDelete,
    editingPost,
} from '../../modules/Post'

class PostPage extends Component {
    render() {
        return (
            <Post
                userPhotoUrl={this.props.userPhotoUrl}
                post={this.props.navigation.state.params.post}
                comment={this.props.navigation.state.params.comment}
                getInsidePost={this.props.getInsidePost}
                navigation={this.props.navigation}
                setPostFavorite={this.props.setPostFavorite}
                creatingComment={this.props.creatingComment}
                deletingComment={this.props.deletingComment}
                editingComment={this.props.editingComment}
                deletingPost={this.props.deletingPost}
                setCommentFavorite={this.props.setCommentFavorite}
                initSetPost={this.props.initSetPost}
                initPostToReducer={this.props.initPostToReducer}
                syncPost={this.props.syncPost}
                syncPostDelete={this.props.syncPostDelete}
                editingPost={this.props.editingPost}
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
    deletingPost,
    setCommentFavorite,
    initSetPost,
    initPostToReducer,
    syncPost,
    syncPostDelete,
    editingPost,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);