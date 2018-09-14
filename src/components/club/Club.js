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

class Club extends React.Component {
  
  randomClub = () => {

    const cids = Object.keys(this.props.clubs)
    if(cids.length != 0) {
      const number = Math.floor(Math.random() * cids.length)
      return this.props.clubs[cids[number]]
    } else {
      return null
    }
    
  }

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
    },
    club: this.randomClub(),
  }

  render() {
    if(this.state.club) {
      const { user, clubs } = this.props
      const clubsArray = Object.keys(clubs).map(
        (cid) => {
          return {
            cid: cid,
            schoolName: clubs[cid].schoolName,
            clubName: clubs[cid].clubName,
          }
        }
      )
      const { schoolName, clubName, open, member, introduction} = this.state.club
      const numberOfMember = Object.keys(member).length
      
      return (
        <View style={{flex: 1, marginTop: Expo.Constants.statusBarHeight}}>
          <View style={{flex: 1}}>
            <ScrollView>
              
              <View style={{height: 400, alignItems: 'center', justifyContent: 'center',}}>
                <View style={{position: 'absolute', height: 400, width: '100%'}}>
                  <Image source={{uri: this.props.imgUrl}} resizeMode='contain' style={{height: 400}}/>
                </View>
                <Text>{schoolName}</Text>
                <Text>{clubName}</Text>
                <Text>{open ? '公開' : '非公開'}</Text>
                <Text>{numberOfMember}</Text>
                <Text>{numberOfMember != 0 ? member[user.uid].status : '沒有成員'}</Text>
              </View>
    
              <View style={{height: 100, flexDirection: 'row'}}>
                <Button title='發布文章' onPress={() => this.props.navigation.push('AddPost', {schoolName, clubName, status: member[user.uid].status})}/>
                <Button title='舉辦活動'/>
                <Button title='切換管理者'/>
                <Button title='編輯成員'/>
              </View>
    
              <View style={{height: 200, borderWidth: 1, borderColor: 'red'}}>
                <Text>{introduction}</Text>
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
              <ModalDropdown 
                defaultValue={schoolName + '  ' + clubName}
                options={clubsArray}
                onSelect={(index, rowData) => this.setState({club: clubs[rowData.cid]})}
                renderButtonText={(rowData) => (rowData.schoolName + '  ' + rowData.clubName)}
                renderRow={(rowData, rowId) => {
                  const { schoolName, clubName } = rowData
                  return <Text>{ schoolName + '  ' + clubName }</Text>
                }}
              />
            </View>
          </View>
          
        </View>

      )
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <Text>您尚未擁有任何社團</Text>
        </View>
      )
    }
    
    
  }
}

export default Club