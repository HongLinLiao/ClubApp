import { } from '../../modules/App'
import { connect } from 'react-redux';
import FavoriteClub from '../../components/personal/FavoriteClub'


const mapStateToProps = ({ userReducer, settingReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(FavoriteClub);