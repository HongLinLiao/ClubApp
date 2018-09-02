import React from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  Image
} from 'react-native'

import ModalDropdown from 'react-native-modal-dropdown'; 

class Club extends React.Component {
  state = {
    
  }

  render() {
    return (
      <View style={{flex: 1}}>
        
        <View style={{}}>
          <View style={{position: 'absolute', height: 400}}>
            <Image source={{uri: this.props.imgUrl}} resizeMode='contain' style={{height: 400}}/>
          </View>
          <ModalDropdown options={['option 1', 'option 2']}/>
          <Text>{大學名稱}</Text>
          <Text>{社團名稱}</Text>
          <Text>{是否公開}</Text>
          <Text>{成員數}</Text>
          <Text>{職位}</Text>
        </View>
        

      </View>
    )
  }
}

export default Club