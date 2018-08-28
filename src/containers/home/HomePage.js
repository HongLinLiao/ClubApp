import { connect } from 'react-redux'
import { getPostList , setPostListToPost ,setClubList} from '../../modules/Home'
import PostList from '../../components/home/PostList'

const mapStateToProps = ({ homeReducer ,userReducer}) => ({
    postList: homeReducer.postList ,
    post: homeReducer.post ,
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    clubList: homeReducer.clubList
})

const mapDispatchToProps = {
    setClubList ,
    getPostList ,
    setPostListToPost
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList);