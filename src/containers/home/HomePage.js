import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getHomePostList, determinToSearch } from '../../modules/Home'
import { setPostFavorite, getInsidePost } from '../../modules/Post'
import PostList from '../../components/post/PostList'

class HomePage extends Component {
    render() {
        return (
            <PostList
                postList={this.props.postList}
                clubList={this.props.clubList}
                getHomePostList={this.props.getHomePostList}
                setPostListToPost={this.props.setPostListToPost}
                navigation={this.props.navigation}
                determinToSearch={this.props.determinToSearch}
                setPostFavorite={this.props.setPostFavorite}
                getInsidePost={this.props.getInsidePost}
            />
        );
    }
}

const mapStateToProps = ({ homeReducer }) => ({
    postList: homeReducer.postList,
    clubList: homeReducer.clubList
})

const mapDispatchToProps = {
    getHomePostList,
    determinToSearch,
    setPostFavorite,
    getInsidePost
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);