import { sendVerifiedMail } from '../../modules/Auth'
import { connect } from 'react-redux';
import SendEmailSuccessful from '../../components/personal/SendEmailSuccessful'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  password: userReducer.password
})

const mapDispatchToProps = {
  sendVerifiedMail
}


export default connect(mapStateToProps, mapDispatchToProps)(SendEmailSuccessful);