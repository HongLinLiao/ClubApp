import React, { Component } from 'react'
import { connect } from 'react-redux'
import HomeActivities from '../../components/home/HomeActivities'

class HomeActivitiesPage extends Component {
    render() {
        return (
            <HomeActivities

            />
        )
    }
}

const mapStateToProps = ({ homeReducer }) => ({

})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeActivitiesPage);