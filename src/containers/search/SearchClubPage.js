import React from 'react'
import { connect } from 'react-redux';
import SearchClub from '../../components/search/SearchClub'
import { joinTheClub, likeTheClub } from '../../modules/Club'
import {
    getPostDataComplete,
    getInsidePost,
    setPostFavorite,
    getPostComment
} from '../../modules/Post'
import {
    getActivityDataFromClubKey,
    getInsideActivity,
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
    getPostDataComplete,
    //取得單一貼文資料
    getInsidePost,
    //取得留言
    getPostComment,
    //按讚
    setPostFavorite,
    getActivityDataFromClubKey,
    getInsideActivity,
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchClub);