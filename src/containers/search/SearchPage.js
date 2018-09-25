import React from 'react'
import { connect } from 'react-redux';
import Search from '../../components/search/Search'
import { setClubOpen, changeClubPhoto } from '../../modules/Club'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    clubs: clubReducer.clubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    setClubOpen,
    changeClubPhoto,
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);