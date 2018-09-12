import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';

const PostListElement = (element) => {

    const { titleText } = styles;
    const { views, favorites } = element;
    return (
        <View>
            <TouchableOpacity onPress={ () => element.navigation.navigate('Post', element)}>
                <Text>{element.schoolName}</Text>
                <Text>{element.clubName}</Text>
                <Text>{element.posterNickName}</Text>
                <Text>{element.posterStatusChinese}</Text>
                <Text style={titleText}>{element.title}</Text>
                <Text>{element.content}</Text>
                <Text>{element.date}</Text>
                <TouchableOpacity onPress={() => console.log('views')}>
                    <Text>觀看人數: {element.numViews} {element.statusView.toString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('favorites')}>
                    <Text>按讚人數: {element.numFavorites} {element.statusFavorite.toString()}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    titleText: {
        fontSize: 28,
    }
};

export default PostListElement;