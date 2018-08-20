import { updateUserProfile } from '../../modules/User'
import { connect } from 'react-redux';
import AdvancedSetting from '../../components/personal/AdvancedSetting'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  aboutMe: userReducer.aboutMe
})

const mapDispatchToProps = {
  updateUserProfile
}


export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSetting);