import { connect } from 'react-redux'
import { getPostList , setPostListToPost } from '../../modules/HomeModule'
import PostList from '../../components/home/PostList'

const mapStateToProps = ({ homeReducer ,userReducer}) => ({
    postList: homeReducer.postList ,
    post: homeReducer.post ,
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub
})

const mapDispatchToProps = {
    getPostList ,
    setPostListToPost
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList);