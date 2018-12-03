import React from 'react'
import { connect } from 'react-redux';
import SearchClub from '../../components/search/SearchClub'
import { joinTheClub, likeTheClub } from '../../modules/Club'
import {
    getClubPostReload,
    getInsidePost,
    setPostFavorite,
    initSetPostList,
    syncPost,
    syncPostDelete,
    syncPostBack,
} from '../../modules/Post'
import {
    getClubActivityReload,
    getInsideActivity,
    setActivityFavorite,
    initSetActivityList,
    syncActivity,
    syncActivityDelete,
    syncActivityBack
} from '../../modules/Activity'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClubs: clubReducer.joinClubs,
    likeClubs: clubReducer.likeClubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    joinTheClub,
    likeTheClub,
    //貼文類
    getClubPostReload,//取得社團下貼文
    getInsidePost,//進入貼文內頁
    setPostFavorite,//貼文按讚
    //同步貼文類
    initSetPostList,
    syncPost,
    syncPostDelete,
    syncPostBack,
    //活動類
    getClubActivityReload,
    getInsideActivity,
    setActivityFavorite,
    initSetActivityList,
    syncActivity,
    syncActivityDelete,
    syncActivityBack,
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchClub);