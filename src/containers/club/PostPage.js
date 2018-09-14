import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostData from '../../components/club/PostData'
import { getInsidePost, setPostFavorite } from '../../modules/Post'

class PostPage extends Component {
    render() {

        switch (this.props.navigation.state.params.router) {
            case 'Home':
                return (
                    <PostData
                        clubKey={this.props.navigation.state.params.clubKey}
                        postKey={this.props.navigation.state.params.postKey}
                        router={this.props.navigation.state.params.router}
                        setPostFavorite={this.props.setPostFavorite}
                        getInsidePost={this.props.getInsidePost}
                        post={this.props.homePost}
                    />
                );
            default:
                return null;
        }


    }
}

const mapStateToProps = ({ homeReducer }) => ({
    homePostList: homeReducer.postList,
    homePost: homeReducer.post
})

const mapDispatchToProps = {
    setPostFavorite,
    getInsidePost
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);