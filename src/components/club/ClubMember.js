import React from 'react'
import {
    View,
    Button,
} from 'react-native'

import {
    List,
    ListItem,
    left,
    Thumbnail,
    Text,
    Right,
    Body,
    Left,
} from 'native-base'

class ClubMember extends React.Component {
    state = {
        data: [{
        
            img: 'https://free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
            name: 'kevin',
            time: '3個月',

        }]
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <List>
                    <ListItem itemHeader>
                        <Text>社長</Text>
                    </ListItem>
                    {this.state.data.map((item, index) => (
                        <ListItem avatar>
                            <Left>
                                <Thumbnail source={{uri: item.img}}/>
                            </Left>
                            
                                <Text>{item.name}</Text>
                                <Text>{item.time}</Text>
                            
                            <Right>
                                <Button title='退出社團'/>
                            </Right>
                        </ListItem>
                    ))}
                    
                </List>
            </View>
        )
    }
}

export default ClubMember