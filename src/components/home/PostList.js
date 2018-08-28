import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import PostListElement from './PostListElement'

class PostList extends React.Component {

    componentWillMount() {
        this.setClub();
    }

    componentDidMount() {
        this.getPost();
    }

    setClub = async () => {
        const { setClubList, joinClub, likeClub } = this.props;
        await setClubList(joinClub, likeClub);//取得user club
    }

    getPost = async () => {
        const { getPostList } = this.props;
        await getPostList(); //取得貼文列
    }

    goSelectingPage = (navigation) => {
        navigation.navigate('Selecting')
    }

    render() {
        return (
            <ScrollView>
                <Button
                    title='reload!'
                    onPress={()=>{this.getPost();}}
                />
                <Button
                    title='selecting!'
                    onPress={() => { this.goSelectingPage(this.props.navigation);}}
                />
                {
                    this.props.postList.map((element) => (
                        <PostListElement
                            key={element.title}
                            title={element.title}
                            clubName={element.clubName}
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