import { sendResetMail } from '../../modules/Auth'
import { connect } from 'react-redux';
import SendEmailResult from '../../components/auth/SendEmailResult'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user
})

const mapDispatchToProps = {
  sendResetMail
}


export default connect(mapStateToProps, mapDispatchToProps)(SendEmailResult);