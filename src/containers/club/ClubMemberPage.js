import React from 'react'
import { setCurrentClub } from '../../actions/ClubAction'
import { kickClubMember } from '../../modules/Club'
import { connect } from 'react-redux';
import ClubMember from '../../components/club/ClubMember'

const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    clubs: clubReducer.clubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    setCurrentClub,
    kickClubMember
}


export default connect(mapStateToProps, mapDispatchToProps)(ClubMember);