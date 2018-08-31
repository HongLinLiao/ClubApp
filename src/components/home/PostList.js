import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import PostListElement from './PostListElement'

class PostList extends React.Component {

    componentDidMount(){
        this.setHomeData();
    }
    
    setHomeData = async () => {
        const { getHomeClubList, joinClub, likeClub, getHomePostList } = this.props;
        //從userReducer將UserClubs存入homeReducer
        const clubList = await getHomeClubList(joinClub, likeClub);
        //用clubList去搜尋產生postList
        await getHomePostList(clubList);
    }

    //進入內頁onPress()事件，放入postList讓元件render
    goSelectingPage = (navigation) => {
        navigation.navigate('Selecting')
    }

    render() {

        return (
            <ScrollView>
                <Button
                    title='reload!'
                    onPress={() => { this.props.getHomePostList(this.props.clubList); }}
                />
                <Button
                    title='selecting!'
                    onPress={() => { this.goSelectingPage(this.props.navigation); }}
                />
                {
                    Object.values(this.props.postList).map((element) => (
                        <PostListElement
                            key = {element.postKey}
                            {...element}
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