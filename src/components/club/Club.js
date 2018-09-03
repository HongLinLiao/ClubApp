import React from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native'

import Expo from 'expo'

import ModalDropdown from 'react-native-modal-dropdown'; 
import PostComponent from './PostData'
import { Item } from 'native-base';

class Club extends React.Component {
  state = {
    activities: {
      act1: {},
      act2: {},
      act3: {},
    },
    posts: {
      post1: {schoolName: '長庚大學', clubName: '熱舞社', title: '繳社費囉~~~~'},
      post2: {},
      post3: {},
    }
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: Expo.Constants.statusBarHeight}}>
        <ScrollView>
          
          <View style={{height: 400}}>
            <View style={{position: 'absolute', height: 400}}>
              <Image source={{uri: this.props.imgUrl}} resizeMode='contain' style={{height: 400}}/>
            </View>
            <Text>{'大學名稱'}</Text>
            <Text>{'社團名稱'}</Text>
            <Text>{'是否公開'}</Text>
            <Text>{'成員數'}</Text>
            <Text>{'職位'}</Text>
          </View>

          <View style={{height: 100, flexDirection: 'row'}}>
            <Button title='發布文章'/>
            <Button title='舉辦活動'/>
            <Button title='切換管理者'/>
            <Button title='編輯成員'/>
          </View>

          <View style={{height: 200, borderWidth: 1, borderColor: 'red'}}>
            <Text>{'社團介紹'}</Text>
          </View>

          <View style={{height: 200, borderWidth: 1, borderColor: 'red'}}>
            <Text>最新活動</Text>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'row'}}>
                {Object.keys(this.state.activities).map(
                  (actId, index) => {
                    return (
                      <TouchableOpacity key={actId}>
                        <Image source={require('../../images/search.png')} style={{height: 50, width: 50}}/>
                      </TouchableOpacity>
                    )
                  }
                )}
                <Button title='查看更多'/>
              </View>
            </ScrollView>
          </View>
          
          <View style={{height: 500, borderWidth: 1, borderColor: 'red'}}>
            <Text>最新文章</Text>
            {Object.keys(this.state.posts).map(
              (postId, index) => {
                return (
                  <View key={postId} style={{height: 100, borderWidth: 1, borderColor: 'green'}}>
                    <PostComponent post={this.state.posts[postId]}/>
                  </View>     
                )
              }
            )}
            <Button title='查看更多'/>
          </View>
        </ScrollView>
        <View style={{position: 'absolute', top: 20, left: 50}}>
          <ModalDropdown defaultValue='請選擇社團' options={['長庚大學 熱舞社', '長庚大學 吉他社']}/>
        </View>
      </View>
    )
  }
}

export default Club