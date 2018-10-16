import React from 'react'
import { ScrollView, Text, Alert, Image, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import PostListElement from '../post/PostListElement'
import styles from '../../styles/home/Home'
import { View } from 'native-base';
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog' 


const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class Home extends React.Component {
    async componentDidMount() {
        const { joinClub, likeClub, initHomeClubList } = this.props;
        const homeClubList = await initHomeClubList(joinClub, likeClub);
        await this.homeReload(homeClubList);
    }

    state = {
        post: {},
        userData: { uid: null, user: null, clubs: null},
        loading: false
    }

    //頁面重整
    homeReload = async clubList => {
        const { getHomePostReload } = this.props;
        await getHomePostReload(clubList, newPostList => {
        this.setState({ post: newPostList });
        });
    };
        

    //更改postList
    setPostList = postList => {
        this.setState({ post: postList });
    };

    //進入內頁onPress()事件，放入postList讓元件render
    goSelectingPage = navigation => {
        navigation.navigate("Selecting", this.homeReload);
    };

    showUser = async (uid) => {
        try {
            this.popupDialog.show(async () => {
                this.setState({loading: true, userData: { uid: null, user: null, clubs: null}})
                const userData = { uid, user: {}, clubs: {}}
                const user = await getUserData(uid)

                if(user.joinClub) {
                    const promises = Object.keys(user.joinClub).map(async (cid) => {
                        const club = await getClubData(cid)
                        userData.clubs[cid] = club
                    })

                    await Promise.all(promises)
                }

                userData.user = user

                this.setState({userData, loading: false})
            });
        } catch(e) {
            Alert.alert(e.toString())
        }
        
    }

    render() {
        const newPostList = { ...this.state.post };
        const { uid, user, clubs } = this.state.userData
        return (
            <View style={{ backgroundColor: "#ffffff", flex: 1 }}>
                <ScrollView>
                    <Button
                        title='Stories!'
                        onPress={() => { this.props.navigation.navigate('Stories'); }}
                    />
                    <Button
                        title='selecting!'
                        onPress={() => { this.goSelectingPage(this.props.navigation); }}
                    />
                    <Button
                        title='reload!'
                        onPress={async () => {
                            await this.homeReload(this.props.clubList);
                        }}
                    />
                    <View style={styles.containView}>
                    {
                        Object.values(newPostList).map((clubElement) => (
                            Object.values(clubElement).map((postElement) => (
                                <PostListElement
                                    key={postElement.postKey}
                                    post={postElement}
                                    navigation={this.props.navigation}
                                    getInsidePost={this.props.getInsidePost}
                                    getPostComment={this.props.getPostComment}
                                    setPostFavorite={this.props.setPostFavorite}
                                    postList={this.state.post}
                                    setPostList={this.setPostList}
                                    showUser={this.showUser.bind(this)}
                                >
                                </PostListElement>
                            ))
                        ))
                    
                    }
                    </View>
                </ScrollView>
                <PopupDialog
                    ref={(popupDialog) => this.popupDialog = popupDialog}
                    dialogAnimation={slideAnimation}
                    width={0.7}
                    height={0.7}
                    dialogStyle={{borderRadius: 20}}
                >
                    <UserDialog
                        uid={uid}
                        user={user}
                        clubs={clubs}
                    />
                    {this.state.loading ? <Overlayer /> : null}
                </PopupDialog> 

                <TouchableOpacity style={styles.star}
                onPress={() => { this.props.navigation.navigate('Stories'); }}>
                    <View style={styles.starButtonView}>
                        <Image source={require('../../images/images2/star.png')}
                            style={styles.starImage} />
                    </View>
                </TouchableOpacity>
            </View> 
        );
    }
}

export default Home;
