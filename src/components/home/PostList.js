import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import PostListElement from './PostListElement'

class PostList extends React.Component {

    componentDidMount() {
        this.getPost()
    }

    getPost = async () => {
        const { getPostList, joinClub, likeClub } = this.props;
        await getPostList(joinClub, likeClub); //取得貼文列
    }

    goSelectingPage = (element) => {
        element.navigate('Selecting')
    }

    render() {
        return (
            <ScrollView>
                <Button
                    title='selecting!'
                    onPress={() => { this.goSelectingPage(this.props.navigation) }}
                />
                {
                    this.props.postList.map((element) => (
                        <PostListElement
                            key={element.title}
                            title={element.title}
                            date={element.date}
                            content={element.content}
                            poster={element.poster}
                            memo={element.memo}
                            navigation={this.props.navigation}
                            setPostListToPost={this.props.setPostListToPost}
                        >
                        </PostListElement>
                    ))
                }
            </ScrollView>
        );
    }
}

export default PostList