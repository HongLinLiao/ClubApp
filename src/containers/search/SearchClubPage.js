import React from 'react'
import { connect } from 'react-redux';
import SearchClub from '../../components/search/SearchClub'
import { joinTheClub } from '../../modules/Club'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    clubs: clubReducer.clubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    joinTheClub
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchClub);