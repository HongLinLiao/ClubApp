import React from 'react'
import { connect } from 'react-redux';
import Search from '../../components/search/Search'
import { joinTheClub } from '../../modules/Club'
import { setCurrentClub } from '../../actions/ClubAction'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    clubs: clubReducer.clubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    joinTheClub,
    setCurrentClub,
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);