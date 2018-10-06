import React, { Component } from 'react'
import { connect } from 'react-redux'
import Post from '../../components/post/Post'
import { setPostFavorite, creatingComment, deletingComment, editingComment, setCommentEditStatus, getInsidePost } from '../../modules/Post'

class PostPage extends Component {
    render() {
        // switch (this.props.navigation.state.params) {
        //     case 'Home':
        //         return (
        //             <Post
        //                 setPostFavorite={this.props.setPostFavorite}
        //                 creatingComment={this.props.creatingComment}
        //                 deletingComment={this.props.deletingComment}
        //                 editingComment={this.props.editingComment}
        //                 setCommentEditStatus={this.props.setCommentEditStatus}
        //                 router={this.props.navigation.state.params}
        //                 navigation={this.props.navigation}
        //                 postList={this.props.homePostList}
        //                 post={this.props.homePost}
        //                 comment={this.props.homeComment}
        //                 getInsidePost={this.props.getInsidePost}
        //             />
        //         );
        //     default:
        //         return null;
        // }
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
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);