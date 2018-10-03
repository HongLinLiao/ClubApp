import { quitTheClub } from '../../modules/App'
import { connect } from 'react-redux';
import FavoriteClub from '../../components/personal/FavoriteClub'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  clubs: clubReducer.clubs,
  likeClub: userReducer.joinClub
})

const mapDispatchToProps = {
  quitTheClub
}


export default connect(mapStateToProps, mapDispatchToProps)(FavoriteClub);