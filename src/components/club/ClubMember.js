import React from 'react'
import {
    View,
    Button,
} from 'react-native'

import {
    ListItem,
} from 'react-native-elements'

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
                {this.state.data.map((item, index) => (
                    <ListItem
                        key={index}
                        leftAvatar={{
                            source: {uri: item.img},
                            size: 'medium',
                        }}
                        title={item.name}
                        subtitle={item.time}
                        rightElement={<Button title='退出社團' onPress={() => {}}/>}
                    />
                ))}
            </View>
        )
    }
}

export default ClubMember