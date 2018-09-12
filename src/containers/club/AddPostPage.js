import { } from '../../modules/App'
import { connect } from 'react-redux';
import AddPost from '../../components/club/AddPost'
import { selectPhoto, takePhoto } from '../../modules/Common'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
  user: userReducer.user,
  clubs: clubReducer.clubs
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(AddPost);