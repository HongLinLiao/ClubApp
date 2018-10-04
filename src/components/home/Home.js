import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import PostListElement from '../post/PostListElement'

class Home extends React.Component {

    async componentDidMount() {
        const { joinClub, likeClub, initHomeClubList, getHomePostReload, determinToSearch } = this.props;
        const homeClubList = await initHomeClubList(joinClub, likeClub);
        const newPost = await this.homeReload(getHomePostReload, homeClubList);
        await determinToSearch(homeClubList, newPost);
    }

    state = {
        post: {}
    }

    //頁面重整
    homeReload = async (getHomePostReload, clubList) => {
        const newPost = await getHomePostReload(clubList, (newPostList) => { this.setState({ post: newPostList }) });
        return newPost;
    }

    //進入內頁onPress()事件，放入postList讓元件render
    goSelectingPage = (navigation) => {
        navigation.navigate('Selecting', this.homeReload)
    }

    render() {
        const newPostList = { ...this.state.post };
        return (
            <ScrollView>
                <Button
                    title='selecting!'
                    onPress={() => { this.goSelectingPage(this.props.navigation); }}
                />
                <Button
                    title='reload!'
                    onPress={async () => {
                        const newPost = await this.homeReload(this.props.getHomePostReload, this.props.clubList); 
                        const { determinToSearch } = this.props;
                        await determinToSearch(this.props.clubList, newPost);
                    }}
                />
                {
                    Object.values(newPostList).map((clubElement) => (
                        Object.values(clubElement).map((postElement) => (
                            <PostListElement
                                key={postElement.postKey}
                                post={postElement}
                                navigation={this.props.navigation}
                                getInsidePost={this.props.getInsidePost}
                                setPostFavorite={this.props.setPostFavorite}
                            >
                            </PostListElement>
                        ))
                    ))
                }
            </ScrollView>
        );
    }
}

export default Home