import {} from '../../modules/App'
import {
    connect
} from 'react-redux';
import AddActivity from '../../components/club/AddActivity'
import {
    createActivity
} from '../../modules/Activity'

const mapStateToProps = ({
    userReducer,
    clubReducer
}) => ({
    user: userReducer.user,
    clubs: clubReducer.clubs
})

const mapDispatchToProps = {
    createActivity
}


export default connect(mapStateToProps, mapDispatchToProps)(AddActivity);