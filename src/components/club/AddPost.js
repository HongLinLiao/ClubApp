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
    images: []
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

  setData = () => {
    this.setState({
      images: [
        'https://www.w3schools.com/w3css/img_lights.jpg',
        'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg'
      ]
    })
  }

  render() {
    const { displayName } = this.props.user
    const { schoolName, clubName, status} = this.props.navigation.state.params
    return (
      <View style={{flex: 1}}>
        <Button title='hahaha' onPress={() => this.setData()} />
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
          <ScrollView horizontal style={{height: 100}}>
            <View style={{flexDirection: 'row', height: 100}}>
              {
                this.state.images.map((uri, index) => {
                  <View style={{height: 100, width: 100, margin: 5}}>
                    <Image source={{uri}} resizeMode='cover' style={{height: 100, width: 100}}/>
                  </View>
                })
              }
            </View>            
          </ScrollView>
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