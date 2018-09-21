import React, { Component } from 'react'
import { connect } from 'react-redux'
import Post from '../../components/post/Post'
import { setPostFavorite, creatingComment, deletingComment, editingComment ,setCommentEditStatus } from '../../modules/Post'

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
                        post={this.props.homePost}
                        comment={this.props.homeComment}
                    />
                );
            default:
                return null;
        }

    }
}

const mapStateToProps = ({ homeReducer }) => ({
    //這裡不用傳postList，只要傳post
    homePost: homeReducer.post,
    homeComment: homeReducer.comment
})

const mapDispatchToProps = {
    setPostFavorite,
    creatingComment,
    deletingComment,
    editingComment,
    setCommentEditStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);