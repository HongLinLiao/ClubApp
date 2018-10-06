import React from 'react'
import { connect } from 'react-redux';
import Search from '../../components/search/Search'
import { joinTheClub } from '../../modules/Club'
import { setCurrentClub } from '../../actions/ClubAction'
import {
    getInsidePost,
    setPostFavorite,
    getPostComment,
    getPostDataComplete
} from '../../modules/Post'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    clubs: clubReducer.clubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    joinTheClub,
    setCurrentClub,
    getPostDataComplete,
    //取得單一貼文資料
    getInsidePost,
    //取得留言
    getPostComment,
    //按讚
    setPostFavorite,
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);