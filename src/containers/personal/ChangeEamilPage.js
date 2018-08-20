import { changeEmail } from '../../modules/Auth'
import { connect } from 'react-redux';
import ChangeEamil from '../../components/personal/ChangeEamil'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
  password: userReducer.password
})

const mapDispatchToProps = {
  changeEmail
}


export default connect(mapStateToProps, mapDispatchToProps)(ChangeEamil);