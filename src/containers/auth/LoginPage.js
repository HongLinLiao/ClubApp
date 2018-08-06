import { signInWithEmail, signInWithFacebook, signInWithGoogle } from '../../modules/Auth'
import { connect } from 'react-redux';
import Login from '../../components/auth/Login'


const mapStateToProps = ({ authReducer }) => ({
  user: authReducer.user
})

const mapDispatchToProps = {
  signInWithEmail,
  signInWithFacebook,
  signInWithGoogle
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);

