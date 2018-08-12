import { connect } from 'react-redux'
import { sendVerifiedMail, emailVerified } from '../../modules/Auth'
import { setVerifyEmailAgain } from '../../actions/AuthAction'
import EmailVerify from '../../components/auth/EmailVerify'


const mapStateToProps = ({ authReducer }) => ({
  user: authReducer.user
})

const mapDispatchToProps = {
  sendVerifiedMail,
  setVerifyEmailAgain,
  emailVerified
}


export default connect(mapStateToProps, mapDispatchToProps)(EmailVerify)