import { } from '../../modules/App'
import { connect } from 'react-redux';
import FavoriteClub from '../../components/personal/FavoriteClub'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  likeClub: userReducer.likeClub,
  clubs: clubReducer.clubs,
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(FavoriteClub);