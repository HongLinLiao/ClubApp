import { } from '../../modules/App'
import { connect } from 'react-redux';
import CreateClub from '../../components/personal/CreateClub'


const mapStateToProps = ({ userReducer, settingReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(CreateClub);