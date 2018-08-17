import { sendResetMail } from '../../modules/Auth'
import { connect } from 'react-redux';
import ForgotPassword from '../../components/auth/ForgotPassword'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  success: userReducer.success
})

const mapDispatchToProps = {
  sendResetMail
}


export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);