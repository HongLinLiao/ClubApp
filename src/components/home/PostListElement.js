import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

const PostListElement = (element) => {

    const { titleText } = styles;

    return (
        <View>
            <Text>{element.poster}</Text>
            <Text style={titleText}>{element.title}</Text>
            <Text>{element.memo}</Text>
            <Text>{element.date}</Text>
            <Button
                title='go insidePage!'
                onPress={async() => await element.setPostListToPost(element)}
            />
        </View>
    );

    
};

const styles = {
    titleText: {
        fontSize: 28,
    }
};

export default PostListElement;