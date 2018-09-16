import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostData from '../../components/post/PostData'
import { setPostFavorite } from '../../modules/Post'

class PostPage extends Component {
    render() {
        switch (this.props.navigation.state.params) {
            case 'Home':
                return (
                    <PostData
                        setPostFavorite={this.props.setPostFavorite}
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
    setPostFavorite
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);