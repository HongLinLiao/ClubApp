import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import PostListElement from './PostListElement'

class PostList extends React.Component {


    componentWillMount() {
        const { determinToSearch, clubList, postList } = this.props;
        // determinToSearch(clubList, postList);
    }

    getHomePost = async () => {
        const { getHomePostList, clubList, determinToSearch } = this.props;
        //用clubList去搜尋產生postList
        const newPostList = await getHomePostList(clubList);
        await determinToSearch(clubList, newPostList);
    }

    //進入內頁onPress()事件，放入postList讓元件render
    goSelectingPage = (navigation) => {
        navigation.navigate('Selecting')
    }

    render() {
        const newPostList = { ...this.props.postList };
        return (
            <ScrollView>
                <Button
                    title='reload!'
                    onPress={async () => { await this.getHomePost(); }}
                />
                <Button
                    title='selecting!'
                    onPress={() => { this.goSelectingPage(this.props.navigation); }}
                />
                {
                    Object.values(newPostList).map((element) => (
                        <PostListElement
                            key={element.postKey}
                            post={element}
                            navigation={this.props.navigation}
                            setPostView={this.props.setPostView}
                        >
                        </PostListElement>
                    ))
                }
            </ScrollView>
        );
    }
}

export default PostList