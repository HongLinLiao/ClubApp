import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getHomePostList, determinToSearch } from '../../modules/Home'
import { setPostFavorite, getInsidePost } from '../../modules/Post'
import Home from '../../components/home/Home'

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);