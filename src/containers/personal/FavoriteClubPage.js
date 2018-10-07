import {  } from '../../modules/Club'
import { connect } from 'react-redux';
import FavoriteClub from '../../components/personal/FavoriteClub'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  likeClubs: clubReducer.likeClubs,
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(FavoriteClub);