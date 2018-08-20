import { updateUserProfile } from '../../modules/User'
import { connect } from 'react-redux';
import ProfileSetting from '../../components/personal/ProfileSetting'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  aboutMe: userReducer.aboutMe
})

const mapDispatchToProps = {
  updateUserProfile
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfileSetting);