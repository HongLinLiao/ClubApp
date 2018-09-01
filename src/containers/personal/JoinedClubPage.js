import { quitTheClub } from '../../modules/Club'
import { connect } from 'react-redux';
import JoinedClub from '../../components/personal/JoinedClub'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  clubs: clubReducer.clubs,
  joinClub: userReducer.joinClub
})

const mapDispatchToProps = {
  quitTheClub
}


export default connect(mapStateToProps, mapDispatchToProps)(JoinedClub);