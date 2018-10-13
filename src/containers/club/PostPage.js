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
    deletePostData,
} from '../../modules/Post'

class PostPage extends Component {
    render() {
        return (
            <Post
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
                deletePostData={this.props.deletePostData}
            />
        )
    }
}

const mapStateToProps = ({ homeReducer }) => ({

})

const mapDispatchToProps = {
    getInsidePost,
    setPostFavorite,
    creatingComment,
    deletingComment,
    editingComment,
    setCommentEditStatus,
    deletePostData,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);