import { updateUserPassword } from '../../modules/Auth'
import { connect } from 'react-redux';
import ChangePassword from '../../components/personal/ChangePassword'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  password: userReducer.password
})

const mapDispatchToProps = {
  updateUserPassword
}


export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);