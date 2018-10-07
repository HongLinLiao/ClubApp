import React from 'react'
import { connect } from 'react-redux';
import Search from '../../components/search/Search'
import { joinTheClub, likeTheClub } from '../../modules/Club'
import { setCurrentClub } from '../../actions/ClubAction'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    joinClubs: clubReducer.joinClubs,
    likeClubs: clubReducer.likeClubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    joinTheClub,
    likeTheClub,
    setCurrentClub,
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);