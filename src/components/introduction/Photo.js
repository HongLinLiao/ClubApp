import React from 'react'
import {
  View,
  Image,
  Button,
  Alert,
} from 'react-native'

import Overlayer from '../../components/common/Overlayer'


class Photo extends React.Component {

  state = {
    loading: false,
    setting: false,
  }

  handleChangePhoto = async () => {

    try {
      this.setState({loading: true})
      await this.props.changePhoto()

      this.setState({loading: false, setting: true})
      
    } catch(e) {
      Alert.alert(e.toString())
    }
    
  }

  render() {
    const { user } = this.props
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{  width: 200, height: 200, borderRadius: 100, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10}}>
            <Image source={{uri: user.photoURL}} resizeMode='cover' style={{ width: 200, height: 200, }}/>
        </View>
        <Button title='選擇照片' onPress={() => this.handleChangePhoto()} />
        <Button title={this.state.setting ? '確定' : '稍後設定'} onPress={() => this.props.setUserFirstLgoin(false)}/>

        {this.state.loading ? <Overlayer /> : null }
      </View>
    )
  }
}

export default Photo