import { signOut } from '../../modules/Auth'
import { connect } from 'react-redux';
import Profile from '../../components/personal/Profile'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  joinClub: userReducer.joinClub,
  aboutMe: userReducer.aboutMe,
})

const mapDispatchToProps = {
  signOut
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);