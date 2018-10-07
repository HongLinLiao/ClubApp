import { quitTheClub } from '../../modules/App'
import { connect } from 'react-redux';
import JoinedClub from '../../components/personal/JoinedClub'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  joinClubs: clubReducer.joinClubs,
})

const mapDispatchToProps = {
  quitTheClub
}


export default connect(mapStateToProps, mapDispatchToProps)(JoinedClub);