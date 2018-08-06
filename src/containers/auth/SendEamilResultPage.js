import { sendResetMail } from '../../modules/Auth'
import { connect } from 'react-redux';
import SendEmailResult from '../../components/auth/SendEmailResult'


const mapStateToProps = ({ authReducer }) => ({
  user: authReducer.user
})

const mapDispatchToProps = {
  sendResetMail
}


export default connect(mapStateToProps, mapDispatchToProps)(SendEmailResult);