import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setHomeClubStatus, getHomePostList } from '../../modules/Home'
import SelectClub from '../../components/home/SelectClub'

class HomeSelectingPage extends Component {
    render() {
        return (
            <SelectClub {...this.props} />
        );
    }
}

const mapStateToProps = ({ homeReducer }) => ({
    clubList: homeReducer.clubList,
    postList: homeReducer.postList,
    numSelectingStatusTrue: homeReducer.numSelectingStatusTrue
})

const mapDispatchToProps = {
    setHomeClubStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeSelectingPage);