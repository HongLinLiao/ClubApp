import {} from '../../modules/User'
import { connect } from 'react-redux';
import ProfileSetting from '../../components/personal/ProfileSetting'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {
  
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfileSetting);