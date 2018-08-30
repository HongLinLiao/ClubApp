import {  } from '../../modules/Club'
import { connect } from 'react-redux';
import JoinedClub from '../../components/personal/JoinedClub'


const mapStateToProps = ({ userReducer, settingReducer }) => ({
  user: userReducer.user,
  joinClub: userReducer.joinClub
})

const mapDispatchToProps = {
  
}


export default connect(mapStateToProps, mapDispatchToProps)(JoinedClub);