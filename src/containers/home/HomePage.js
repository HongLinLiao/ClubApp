import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initHomeClubList, getHomePostReload } from '../../modules/Home'
import { getInsidePost, setPostFavorite, initSetPostList, syncPost, syncPostDelete,syncPostBack } from '../../modules/Post'
import Home from '../../components/home/Home'

const mapStateToProps = ({ homeReducer, userReducer }) => ({
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    postList: homeReducer.postList,
    clubList: homeReducer.clubList
})

const mapDispatchToProps = {
    //初始化clubKey
    initHomeClubList,
    //homeReducer重抓資料
    getHomePostReload,
    //取得單一貼文資料
    getInsidePost,
    //按讚
    setPostFavorite,
    //同步貼文
    initSetPostList,
    syncPost,
    syncPostDelete,
    syncPostBack,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
