import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initHomeClubList, getHomePostReload, determinToSearch } from '../../modules/Home'
import { getInsidePost,setPostFavorite } from '../../modules/Post'
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
    //判斷貼文與社團
    determinToSearch,
    //進入貼文內頁
    getInsidePost,
    setPostFavorite,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
