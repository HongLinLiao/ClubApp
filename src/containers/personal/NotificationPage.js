import {  } from '../../modules/Auth'
import { connect } from 'react-redux';
import Notification from '../../components/personal/Notification'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {
  
}


export default connect(mapStateToProps, mapDispatchToProps)(Notification);