import { connect } from 'react-redux'
import { signUpUser, sendVerifiedMail } from '../../modules/Auth'
import * as firebase from "firebase"
import Register from '../../components/auth/Register'

const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  status: userReducer.status
})

const mapDispatchToProps = {
  signUpUser,
  sendVerifiedMail
}


export default connect(mapStateToProps, mapDispatchToProps)(Register)

