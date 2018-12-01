import React, { Component } from 'react'
import { connect } from 'react-redux'
import Activity from '../../components/activity/Activity'
import {
    setActivityFavorite,
    setActivityKeep,
    getInsideActivity,
    initSetActivity,
    initActivityToReducer,
    syncActivity,
    syncActivityDelete,
} from '../../modules/Activity'

class ActivityPage extends Component {
    render() {
        return (
            <Activity
                activity={this.props.navigation.state.params.activity}
                navigation={this.props.navigation}
                setActivityFavorite={this.props.setActivityFavorite}
                setActivityKeep={this.props.setActivityKeep}
                getInsideActivity={this.props.getInsideActivity}
                initSetActivity={this.props.initSetActivity}
                initActivityToReducer={this.props.initActivityToReducer}
                syncActivity={this.props.syncActivity}
                syncActivityDelete={this.props.syncActivityDelete}
            />
        )
    }
}

const mapStateToProps = ({ homeReducer }) => ({

})

const mapDispatchToProps = {
    setActivityFavorite,
    setActivityKeep,
    getInsideActivity,
    initSetActivity,
    initActivityToReducer,
    syncActivity,
    syncActivityDelete,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityPage);