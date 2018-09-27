import { connect } from 'react-redux'
import HomeActivities from '../../components/home/HomeActivities'

const mapStateToProps = ({ homeReducer }) => ({
    activityList: homeReducer.activityList
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeActivities);