import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostData from '../../components/post/PostData'
import { setPostFavorite } from '../../modules/Post'

class PostPage extends Component {
    render() {
        switch (this.props.navigation.state.params) {
            case 'Home':
                return (
                    <PostData
                        setPostFavorite={this.props.setPostFavorite}
                        post={this.props.homePost}
                    />
                );
            //club
            default:
                return null;
        }

    }
}

const mapStateToProps = ({ homeReducer }) => ({
    homePost: homeReducer.post
    //club
})

const mapDispatchToProps = {
    setPostFavorite
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);