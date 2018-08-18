import { connect } from 'react-redux'
// import {  } from '../../modules/HomeModule'
import SelectClub from '../../components/home/SelectClub'

const mapStateToProps = ({ userReducer , homeReducer }) => ({
    user: userReducer.user
})

const mapDispatchToProps = {
    // getPostList ,
    // setPostListToPost
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectClub);