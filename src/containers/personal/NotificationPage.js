import { setGlobalNotification, setNightModeNotification, setClubNotification, setNightModeTime } from '../../modules/App'
import { connect } from 'react-redux';
import Notification from '../../components/personal/Notification'


const mapStateToProps = ({ userReducer, settingReducer, clubReducer }) => ({
  user: userReducer.user,
  globalNotification: settingReducer.globalNotification,
  nightModeNotification: settingReducer.nightModeNotification,
  nightModeStart: settingReducer.nightModeStart,
  nightModeEnd: settingReducer.nightModeEnd,
  clubNotificationList: settingReducer.clubNotificationList,
  joinClubs: clubReducer.joinClubs,
  likeClubs: clubReducer.likeClubs,
})

const mapDispatchToProps = {
  setGlobalNotification,
  setNightModeNotification,
  setClubNotification,
  setNightModeTime,
}


export default connect(mapStateToProps, mapDispatchToProps)(Notification);