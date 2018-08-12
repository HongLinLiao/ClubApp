import { setNickName } from '../../modules/Auth'
import { setUserFirstLgoin } from '../../actions/AuthAction'
import { connect } from 'react-redux';
import NickName from '../../components/introduction/NickName'


const mapStateToProps = ({ authReducer }) => ({
  user: authReducer.user
})

const mapDispatchToProps = {
  setNickName,
  setUserFirstLgoin
}


export default connect(mapStateToProps, mapDispatchToProps)(NickName);