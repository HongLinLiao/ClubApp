import {} from '../../modules/App'
import {
    connect
} from 'react-redux';
import AddActivity from '../../components/club/AddActivity'
import {
    createPost
} from '../../modules/Post'

const mapStateToProps = ({
    userReducer,
    clubReducer
}) => ({
    user: userReducer.user,
    clubs: clubReducer.clubs
})

const mapDispatchToProps = {
    createPost
}


export default connect(mapStateToProps, mapDispatchToProps)(AddActivity);