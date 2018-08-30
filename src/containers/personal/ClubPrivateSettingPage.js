import { createClub } from '../../modules/Club'
import { connect } from 'react-redux';
import ClubPrivateSetting from '../../components/personal/ClubPrivateSetting'


const mapStateToProps = ({ userReducer, settingReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {
  createClub
}


export default connect(mapStateToProps, mapDispatchToProps)(ClubPrivateSetting);