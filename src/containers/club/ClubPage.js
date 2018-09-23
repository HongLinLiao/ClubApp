import React from 'react'
import { setCurrentClub } from '../../actions/ClubAction'
import { } from '../../modules/Club'
import { connect } from 'react-redux';
import Club from '../../components/club/Club'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  clubs: clubReducer.clubs,
  currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
  setCurrentClub
}


export default connect(mapStateToProps, mapDispatchToProps)(Club);