import { changePhoto } from '../../modules/User'
import { setUserFirstLgoin } from '../../actions/UserAction'
import { connect } from 'react-redux';
import Photo from '../../components/introduction/Photo'


const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.user
})

const mapDispatchToProps = {
  changePhoto,
  setUserFirstLgoin
}


export default connect(mapStateToProps, mapDispatchToProps)(Photo);