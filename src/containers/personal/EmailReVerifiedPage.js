import { sendVerifiedMail } from '../../modules/Auth'
import { connect } from 'react-redux';
import EmailReVerified from '../../components/personal/EmailReVerified'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  password: userReducer.password
})

const mapDispatchToProps = {
  sendVerifiedMail
}


export default connect(mapStateToProps, mapDispatchToProps)(EmailReVerified);