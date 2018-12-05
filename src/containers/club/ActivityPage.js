import React, { Component } from 'react'
import { connect } from 'react-redux'
import Activity from '../../components/activity/Activity'
import {
    setActivityFavorite,
    setActivityKeep,
    setActivityJoin,
    getInsideActivity,
    initSetActivity,
    initActivityToReducer,
    syncActivity,
    syncActivityDelete,
    deletingActivity,
    editingActivity,
} from '../../modules/Activity'

class ActivityPage extends Component {
    render() {
        return (
            <Activity
                activity={this.props.navigation.state.params.activity}
                navigation={this.props.navigation}
                editingActivity={this.props.editingActivity}
                deletingActivity={this.props.deletingActivity}
                setActivityFavorite={this.props.setActivityFavorite}
                setActivityJoin={this.props.setActivityJoin}
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
    setActivityJoin,
    getInsideActivity,
    deletingActivity,
    initSetActivity,
    initActivityToReducer,
    syncActivity,
    syncActivityDelete,
    editingActivity,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityPage);