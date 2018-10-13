import React from "react";
import { ScrollView } from "react-native";
import { Button } from "react-native-elements";
import PostListElement from "../post/PostListElement";
import styles from "../../styles/home/Home";
import { View } from "native-base";
class Home extends React.Component {
  async componentDidMount() {
    const { joinClub, likeClub, initHomeClubList } = this.props;
    const homeClubList = await initHomeClubList(joinClub, likeClub);
    await this.homeReload(homeClubList);
  }

  state = {
    post: {}
  };

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

  render() {
    const newPostList = { ...this.state.post };
    return (
      <View style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <ScrollView>
          <Button
            title="Stories!"
            onPress={() => {
              this.props.navigation.navigate("Stories");
            }}
          />
          <Button
            title="selecting!"
            onPress={() => {
              this.goSelectingPage(this.props.navigation);
            }}
          />
          <Button
            title="reload!"
            onPress={async () => {
              await this.homeReload(this.props.clubList);
            }}
          />
          <View style={styles.containView}>
            {Object.values(newPostList).map(clubElement =>
              Object.values(clubElement).map(postElement => (
                <PostListElement
                  key={postElement.postKey}
                  post={postElement}
                  navigation={this.props.navigation}
                  getInsidePost={this.props.getInsidePost}
                  getPostComment={this.props.getPostComment}
                  setPostFavorite={this.props.setPostFavorite}
                  postList={this.state.post}
                  setPostList={this.setPostList}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Home;
