import { sendResetMail } from '../../modules/Auth'
import { connect } from 'react-redux';
import ForgotEmail from '../../components/auth/ForgotEmail'


const mapStateToProps = ({ authReducer }) => ({
  user: authReducer.user,
  status: authReducer.status
})

const mapDispatchToProps = {
  sendResetMail
}


export default connect(mapStateToProps, mapDispatchToProps)(ForgotEmail);