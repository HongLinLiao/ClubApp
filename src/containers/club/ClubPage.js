import React from 'react'
import { setCurrentClub } from '../../actions/ClubAction'
import { randomClub } from '../../modules/Club'
import {
  getPostDataComplete,
  getInsidePost,
  setPostFavorite,
  getPostComment
} from '../../modules/Post'
import { connect } from 'react-redux';
import Club from '../../components/club/Club'

const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  clubs: clubReducer.clubs,
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
}


export default connect(mapStateToProps, mapDispatchToProps)(Club);