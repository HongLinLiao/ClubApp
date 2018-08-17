import React from 'react'
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator
} from 'react-native'

import Overlayer from '../../components/common/Overlayer'


class Photo extends React.Component {

  state = {
    loading: false
  }

  handleChangePhoto = async () => {
    this.setState({loading: true})
    await this.props.changePhoto()

    this.setState({loading: false})
  }

  render() {
    const { user } = this.props
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{  width: 200, height: 200, borderRadius: 100, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10}}>
          { user.photoURL ? 
            <Image source={{uri: user.photoURL}} resizeMode='cover' style={{ width: 200, height: 200, }}/> : 
            <Image source={require('../../images/man-user.png')} resizeMode='contain' style={{height: 200, borderRadius: 100}}/>
          }
        </View>
        <Button title='選擇照片' onPress={() => this.handleChangePhoto()} />
        <Button title='稍後設定' onPress={() => this.props.setUserFirstLgoin(false)}/>

        {this.state.loading ? <Overlayer /> : null }
      </View>
    )
  }
}

export default Photo