import React, { Component } from 'react'
import { connect } from 'react-redux'
import Activity from '../../components/activity/Activity'

class ActivityPage extends Component {
    render() {
        return (
            <Activity
                activity={this.props.navigation.state.params.activity}
                setActivityList={this.props.navigation.state.params.setActivityList}
                activityList={this.props.navigation.state.params.activityList}
                navigation={this.props.navigation}
            />
        )
    }
}

const mapStateToProps = ({ homeReducer }) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityPage);