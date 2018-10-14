import { connect } from 'react-redux';
import Activities from '../../components/club/Activities'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {
 
}


export default connect(mapStateToProps, mapDispatchToProps)(Activities);

