import { sendResetMail } from '../../modules/Auth'
import { connect } from 'react-redux';
import ForgotPassword from '../../components/auth/ForgotPassword'


const mapStateToProps = ({ authReducer }) => ({
  user: authReducer.user,
  success: authReducer.success
})

const mapDispatchToProps = {
  sendResetMail
}


export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);