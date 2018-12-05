import React from 'react'
import { connect } from 'react-redux';
import Search from '../../components/search/Search'
import { joinTheClub, likeTheClub } from '../../modules/Club'
import { syncSearchActivityBack } from '../../modules/Activity'
import { syncSearchPostBack } from '../../modules/Post'
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
    syncSearchActivityBack,
    syncSearchPostBack,
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);