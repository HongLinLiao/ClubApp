import React, { Component } from 'react'
import { connect } from 'react-redux'
import HomeActivities from '../../components/home/HomeActivities'
import { getInsideActivity, setActivityFavorite } from '../../modules/Activity'
import { getHomeActivityReload } from '../../modules/Home'

class HomeActivitiesPage extends Component {
    render() {
        return (
            <HomeActivities
                navigation={this.props.navigation}
                getHomeActivityReload={this.props.getHomeActivityReload}
                getInsideActivity={this.props.getInsideActivity}
                setActivityFavorite={this.props.setActivityFavorite}
            />
        )
    }
}

const mapStateToProps = ({ homeReducer }) => ({
   
})

const mapDispatchToProps = {
    getHomeActivityReload,
    setActivityFavorite,
    getInsideActivity
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeActivitiesPage);