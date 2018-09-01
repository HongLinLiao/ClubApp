import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostData from '../../components/club/PostData'

class PostPage extends Component {
    render() {
        const { post } = this.props.post;
        return (
            <PostData
                post={post}
            />
        );
    }
}

const mapStateToProps = ({ homeReducer }) => ({
    post: homeReducer.post
})

export default connect(mapStateToProps)(PostPage);