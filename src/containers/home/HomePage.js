import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getHomePostList, getHomePostReload, determinToSearch } from '../../modules/Home'
import { setPostFavorite, getInsidePost } from '../../modules/Post'
import Home from '../../components/home/Home'

const mapStateToProps = ({ homeReducer }) => ({
    postList: homeReducer.postList,
    clubList: homeReducer.clubList
})

const mapDispatchToProps = {
    getHomePostList,
    setPostFavorite,
    getInsidePost,
    getHomePostReload,
    determinToSearch
}

<<<<<<< HEAD

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
=======
export default connect(mapStateToProps, mapDispatchToProps)(Home);
>>>>>>> a9657942ef31a82efe1eb9605d69f1c24361f7ca
