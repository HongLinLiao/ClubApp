import { } from '../../modules/App'
import { connect } from 'react-redux';
import Club from '../../components/club/Club'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(Club);