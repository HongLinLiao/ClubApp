import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getHomePostList , determinToSearch } from '../../modules/Home'
import { setPostView } from '../../modules/Post'
import PostList from '../../components/home/PostList'

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
                setPostView={this.props.setPostView}
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
    setPostView
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);