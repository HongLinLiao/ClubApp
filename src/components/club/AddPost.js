import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Button
} from 'react-native';

import { takePhoto, selectPhoto } from '../../modules/Common'


class AddPost extends React.Component {

  state ={
    topic: '',
    content: '',
    data: []
  }

  componentDidMount() {
    this.props.navigation.setParams({
      createPost: this.createPost.bind(this)
    })
  }

  createPost = () => {

  }

  handleTakePhoto = async () => {

    try {

    } catch(e) {
      
    }

  }

  handleSelectPhoto = async () => {
    
    try {

    } catch(e) {
  
    }

  }

  render() {
    const { displayName } = this.props.user
    const { schoolName, clubName, status} = this.props.navigation.state.params
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center',}}>
          <View style={{flexDirection: 'row', width: 100}}>
            <Image source={{}} style={{height: 100, width: 100}}/>
            <View style={{height: 100}}>
              <Text>{schoolName}</Text>
              <Text>{clubName}</Text>
              <Text>{displayName}</Text>
              <Text>{status}</Text>
              <Text>{new Date().toLocaleString()}</Text>
            </View>
          </View>
          <TextInput placeholder='標題' onChangeText={(topic) => this.setState({topic})}/>
          <TextInput 
            placeholder='內容......'
            multiline={true}
            numberOfLines={30}
            style={{
              width: '100%',
              flex: 1,
              backgroundColor: '#ffe6b5' 
            }}
            onChangeText={(content) => this.setState({content})}
          />
        </View>

        <View style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            height: 50,
            width: '100%',
            position: 'absolute', 
            bottom: 0,
            justifyContent: 'space-between'
          }}
        >
          <Button title='拍攝照片' onPress={() => this.handleTakePhoto()}/>
          <Button title='從圖庫取得照片' onPress={() => this.handleSelectPhoto()}/>
        </View>
      </View>
    )
  }
}

export default AddPost