import React from 'react'
import { setCurrentClub } from '../../actions/ClubAction'
import { randomClub } from '../../modules/Club'
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


export default connect(mapStateToProps, mapDispatchToProps)(Club);