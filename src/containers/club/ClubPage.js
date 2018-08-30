import { } from '../../modules/App'
import { connect } from 'react-redux';
import Club from '../../components/club/Club'


const mapStateToProps = ({ userReducer, settingReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(Club);