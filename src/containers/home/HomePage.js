import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getHomeClubList, getHomePostList, setPostListToPost } from '../../modules/Home'
import PostList from '../../components/home/PostList'

class HomePage extends Component {
    render () {
        return (
            <PostList 
                postList={this.props.postList}
                joinClub={this.props.joinClub}
                likeClub={this.props.likeClub}
                clubList={this.props.clubList}
                getHomeClubList={this.props.getHomeClubList}
                getHomePostList={this.props.getHomePostList}
                setPostListToPost={this.props.setPostListToPost}
                navigation={this.props.navigation}
            />
        );
    }
}

const mapStateToProps = ({ homeReducer, userReducer }) => ({
    postList: homeReducer.postList,
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    clubList: homeReducer.clubList
})

const mapDispatchToProps = {
    getHomeClubList,
    getHomePostList,
    setPostListToPost
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);