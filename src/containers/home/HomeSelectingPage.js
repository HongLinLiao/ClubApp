import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setHomeClubListStatus, determinToSearch } from '../../modules/Home'
import SelectClub from '../../components/home/SelectClub'

const mapStateToProps = ({ homeReducer }) => ({
    clubList: homeReducer.clubList,
    numSelectingStatusTrue: homeReducer.numSelectingStatusTrue
})

const mapDispatchToProps = {
    setHomeClubListStatus,
    determinToSearch
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectClub);