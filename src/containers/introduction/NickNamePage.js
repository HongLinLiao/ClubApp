import { setNickName } from '../../modules/User'
import { setUserFirstLgoin } from '../../actions/UserAction'
import { connect } from 'react-redux';
import NickName from '../../components/introduction/NickName'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user
})

const mapDispatchToProps = {
  setNickName,
  setUserFirstLgoin
}


export default connect(mapStateToProps, mapDispatchToProps)(NickName);