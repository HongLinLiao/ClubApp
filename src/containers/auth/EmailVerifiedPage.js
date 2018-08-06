import { connect } from 'react-redux'
import { sendVerifiedMail, reloadUser } from '../../modules/Auth'
import { setVerifyEmailAgain } from '../../actions/AuthAction'
import EmailVerify from '../../components/auth/EmailVerify'


const mapStateToProps = ({ authReducer }) => ({
  user: authReducer.user
})

const mapDispatchToProps = {
  sendVerifiedMail,
  setVerifyEmailAgain,
  reloadUser
}


export default connect(mapStateToProps, mapDispatchToProps)(EmailVerify)