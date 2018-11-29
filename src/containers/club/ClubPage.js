import React from 'react'
import { setCurrentClub } from '../../actions/ClubAction'
import { randomClub } from '../../modules/Club'
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
  getActivityDataFromClubKey,
  getInsideActivity,
} from '../../modules/Activity'
import { connect } from 'react-redux';
import Club from '../../components/club/Club'

const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  joinClub: userReducer.joinClub,
  likeClub: userReducer.likeClub,
  joinClubs: clubReducer.joinClubs,
  likeClubs: clubReducer.likeClubs,
  currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
  setCurrentClub,
  randomClub,
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
  getInsideActivity,
  getActivityDataFromClubKey,
}


export default connect(mapStateToProps, mapDispatchToProps)(Club);