import { connect } from 'react-redux'
import PostData from '../../components/club/postData'

const mapStateToProps = ({ homeReducer }) => ({
    post: homeReducer.post
})

export default connect(mapStateToProps)(PostData);