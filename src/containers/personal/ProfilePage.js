import { signOut } from '../../modules/Auth'
import { connect } from 'react-redux';
import Profile from '../../components/personal/Profile'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {
  signOut
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);