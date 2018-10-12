import React, { Component } from 'react'
import { connect } from 'react-redux'
import Activity from '../../components/activity/Activity'
import {
    setActivityFavorite
} from '../../modules/Activity'

class ActivityPage extends Component {
    render() {
        return (
            <Activity
                activity={this.props.navigation.state.params.activity}
                setActivityList={this.props.navigation.state.params.setActivityList}
                activityList={this.props.navigation.state.params.activityList}
                navigation={this.props.navigation}
                setActivityFavorite={this.props.setActivityFavorite}
            />
        )
    }
}

const mapStateToProps = ({ homeReducer }) => ({

})

const mapDispatchToProps = {
    setActivityFavorite,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityPage);