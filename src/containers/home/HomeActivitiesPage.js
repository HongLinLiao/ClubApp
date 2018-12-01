import React, { Component } from 'react'
import { connect } from 'react-redux'
import HomeActivities from '../../components/home/HomeActivities'
import { getHomeActivityReload } from '../../modules/Home'
import { getInsideActivity, setActivityFavorite, initSetActivityList, syncActivity, syncActivityDelete,syncActivityBack } from '../../modules/Activity'


class HomeActivitiesPage extends Component {
    render() {
        return (
            <HomeActivities
                navigation={this.props.navigation}
                getHomeActivityReload={this.props.getHomeActivityReload}
                getInsideActivity={this.props.getInsideActivity}
                setActivityFavorite={this.props.setActivityFavorite}
                initSetActivityList={this.props.initSetActivityList}
                syncActivity={this.props.syncActivity}
                syncActivityDelete={this.props.syncActivityDelete}
                syncActivityBack={this.props.syncActivityBack}
            />
        )
    }
}

const mapStateToProps = ({ homeReducer }) => ({
   
})

const mapDispatchToProps = {
    getHomeActivityReload,//取得活動
    setActivityFavorite,//活動按讚
    getInsideActivity,//進入活動
    //活動同步
    initSetActivityList,
    syncActivity,
    syncActivityDelete,
    syncActivityBack
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeActivitiesPage);