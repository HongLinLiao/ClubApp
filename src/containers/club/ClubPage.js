import React from 'react'
import { setCurrentClub } from '../../actions/ClubAction'
import { randomClub } from '../../modules/Club'
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
}


export default connect(mapStateToProps, mapDispatchToProps)(Club);