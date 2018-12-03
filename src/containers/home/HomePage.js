import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initHomeClubList, getHomePostReload } from '../../modules/Home'
import {
    getInsidePost,
    setPostFavorite,
    initSetPostList,
    syncPost,
    syncPostDelete,
    syncPostBack
} from '../../modules/Post'
import { syncSearchActivityBack } from '../../modules/Activity'
import Home from '../../components/home/Home'

const mapStateToProps = ({ homeReducer, userReducer }) => ({
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    postList: homeReducer.postList,
    clubList: homeReducer.clubList,
    user: userReducer.user,
})

const mapDispatchToProps = {
    initHomeClubList,//初始化clubKey
    getHomePostReload,//取得首頁貼文
    getInsidePost,//進入貼文內頁
    setPostFavorite,//貼文按讚
    //同步貼文類
    initSetPostList,
    syncPost,
    syncPostDelete,
    syncPostBack,
    //清掉活動返回state
    syncSearchActivityBack
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
