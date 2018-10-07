import { setGlobalNotification, setNightModeNotification, setClubNotification } from '../../modules/App'
import { connect } from 'react-redux';
import Notification from '../../components/personal/Notification'


const mapStateToProps = ({ userReducer, settingReducer, clubReducer }) => ({
  user: userReducer.user,
  globalNotification: settingReducer.globalNotification,
  nightModeNotification: settingReducer.nightModeNotification,
  clubNotificationList: settingReducer.clubNotificationList,
  joinClubs: clubReducer.joinClubs,
  likeClubs: clubReducer.likeClubs,
})

const mapDispatchToProps = {
  setGlobalNotification,
  setNightModeNotification,
  setClubNotification,
}


export default connect(mapStateToProps, mapDispatchToProps)(Notification);