

import { signInWithEmail, signOut } from '../../modules/Auth'
import { connect } from 'react-redux';
import * as firebase from "firebase"
import LoginPage from '../../components/auth/Login'


const mapStateToProps = state => ({
  user: state.userReducer.user
})

const mapDispatchToProps = {
  signInWithEmail,
  signOut
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

