import { sendResetMail } from '../../modules/Auth'
import { connect } from 'react-redux';
import NickName from '../../components/auth/NickName'


const mapStateToProps = ({ authReducer }) => ({
  user: authReducer.user
})

const mapDispatchToProps = {
  sendResetMail
}


export default connect(mapStateToProps, mapDispatchToProps)(NickName);