import React from 'react'
import { ScrollView, Text, Alert, Image, TouchableOpacity, RefreshControl } from 'react-native'
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
        this.setState({ loading: !this.state.loading })
        const homeClubList = await initHomeClubList(joinClub, likeClub);
        this.setState({ loading: !this.state.loading })
        await this.homeReload(homeClubList);
    }

    state = {
        post: [],
        userData: { uid: null, user: null, clubs: null },
        //遮罩
        loading: false,
        //重整
        refreshing: false,
    }

    onRefresh = async () => {
        try {
            const { clubList } = this.props;
            this.setState({ refreshing: true });
            this.setState({ refreshing: false });
            this.homeReload(clubList);
        } catch (error) {
            console.log(error.toString());
        }
    }

    //過門
    homeOverLayor = () => {
        this.setState({ loading: !this.state.loading })
    }

    //頁面重整
    homeReload = async (clubList) => {
        //開啟過門
        this.homeOverLayor();
        const { getHomePostReload } = this.props;
        await getHomePostReload(clubList, newPostList => {
            this.setState({ post: newPostList });
        });
        //關閉過門
        this.homeOverLayor();
    };

    //更改postList
    setPostList = (postList) => {
        this.setState({ post: postList });
    };

    //進入內頁onPress()事件，放入postList讓元件render
    goSelectingPage = (navigation) => {
        navigation.navigate("Selecting", { homeReload: this.homeReload });
    };

    showUser = async (uid) => {
        try {
            this.popupDialog.show(async () => {
                this.setState({ loading: true, userData: { uid: null, user: null, clubs: null } })
                const userData = { uid, user: {}, clubs: {} }
                const user = await getUserData(uid)

                if (user.joinClub) {
                    const promises = Object.keys(user.joinClub).map(async (cid) => {
                        const club = await getClubData(cid)
                        userData.clubs[cid] = club
                    })

                    await Promise.all(promises)
                }

                userData.user = user

                this.setState({ userData, loading: false })
            });
        } catch (e) {
            Alert.alert(e.toString())
        }

    }

    render() {
        const newPostList = JSON.parse(JSON.stringify(this.state.post));
        const { uid, user, clubs } = this.state.userData
        return (
            <View style={{ backgroundColor: "#ffffff", flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                            tintColor='#f6b456'
                        />
                    }
                >
                    <Button
                        title='selecting!'
                        onPress={() => { this.goSelectingPage(this.props.navigation); }}
                    />
                    <View style={styles.containView}>
                        {
                            newPostList.map((postElement) => (
                                Object.values(postElement).map((post) => (
                                    <PostListElement
                                        key={post.postKey}
                                        post={post}
                                        navigation={this.props.navigation}
                                        getInsidePost={this.props.getInsidePost}
                                        getPostComment={this.props.getPostComment}
                                        setPostFavorite={this.props.setPostFavorite}
                                        postList={this.state.post}
                                        setPostList={this.setPostList}
                                        showUser={this.showUser.bind(this)}
                                        parentOverLayor={this.homeOverLayor}
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
                    dialogStyle={{ borderRadius: 20 }}
                >
                    <UserDialog
                        uid={uid}
                        user={user}
                        clubs={clubs}
                        loading={this.state.loading}
                    />
                </PopupDialog>
                {this.state.loading ? <Overlayer /> : null}
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
