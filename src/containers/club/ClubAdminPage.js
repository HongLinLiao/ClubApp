import React from 'react'
import { connect } from 'react-redux';
import ClubAdmin from '../../components/club/ClubAdmin'
import { setClubOpen, changeClubPhoto } from '../../modules/Club'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClubs: clubReducer.joinClubs,
    likeClubs: clubReducer.likeClubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    setClubOpen,
    changeClubPhoto,
}


export default connect(mapStateToProps, mapDispatchToProps)(ClubAdmin);