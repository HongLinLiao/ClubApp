import React from 'react'
import { connect } from 'react-redux';
import SearchClub from '../../components/search/SearchClub'
import { joinTheClub, likeTheClub } from '../../modules/Club'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClubs: clubReducer.joinClubs,
    likeClubs: clubReducer.likeClubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    joinTheClub,
    likeTheClub,
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchClub);