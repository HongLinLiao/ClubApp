import React from 'react'
import { } from '../../modules/App'
import { connect } from 'react-redux';
import AddPost from '../../components/club/AddPost'
import { createPost } from '../../modules/Post'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  joinClubs: clubReducer.joinClubs,
  likeClubs: clubReducer.likeClubs,
  currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
  createPost
}


export default connect(mapStateToProps, mapDispatchToProps)(AddPost);