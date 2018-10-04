import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import PostListElement from '../post/PostListElement'
import styles from '../../styles/home/Home'
import { View } from 'native-base';
class Home extends React.Component {


    componentWillMount() {
        const { determinToSearch, clubList, postList } = this.props;
        // determinToSearch(clubList, postList);
    }

    //頁面重整
    reload = async () => {
        const { getHomePostReload } = this.props;
        const newPostList = await getHomePostReload();
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
                    title='Stories'
                    onPress={() => { }}
                />
                <Button
                    title='selecting!'
                    onPress={() => { this.goSelectingPage(this.props.navigation); }}
                />
                <Button
                    title='reload!'
                    onPress={async () => { await this.reload(); }}
                />
                <View style={styles.containView}>
                {
                    Object.values(newPostList).map((element) => (
                        <PostListElement
                            key={element.postKey}
                            post={element}
                            navigation={this.props.navigation}
                            setPostFavorite={this.props.setPostFavorite}
                            getInsidePost={this.props.getInsidePost}
                            router='Home'
                        >
                        </PostListElement>
                    ))
                
                }
                </View>
            </ScrollView>
        );
    }
}

export default Home