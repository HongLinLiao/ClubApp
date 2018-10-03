import React, { Component } from 'react'
import { connect } from 'react-redux'
import Post from '../../components/post/Post'
import { setPostFavorite, creatingComment, deletingComment, editingComment, setCommentEditStatus, getInsidePost } from '../../modules/Post'

class PostPage extends Component {
    render() {
        switch (this.props.navigation.state.params) {
            case 'Home':
                return (
                    <Post
                        setPostFavorite={this.props.setPostFavorite}
                        creatingComment={this.props.creatingComment}
                        deletingComment={this.props.deletingComment}
                        editingComment={this.props.editingComment}
                        setCommentEditStatus={this.props.setCommentEditStatus}
                        router={this.props.navigation.state.params}
                        navigation={this.props.navigation}
                        postList={this.props.homePostList}
                        post={this.props.homePost}
                        comment={this.props.homeComment}
                        getInsidePost={this.props.getInsidePost}
                    />
                );
            default:
                return null;
        }

    }
}

const mapStateToProps = ({ homeReducer }) => ({
    homePostList: homeReducer.postList,
    homePost: homeReducer.post,
    homeComment: homeReducer.comment
})

const mapDispatchToProps = {
    setPostFavorite,
    creatingComment,
    deletingComment,
    editingComment,
    setCommentEditStatus,
    getInsidePost
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);