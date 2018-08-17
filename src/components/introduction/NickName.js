import React from 'react'
import { 
  Text, 
  View, 
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';

import styles from '../../styles/introduction/NickName'
import Overlayer from '../common/Overlayer'

class NickName extends React.Component{

  state = {
    nickName: '',
    loading: false
  }

  handleSetNickName = async () => {
    const { setNickName, user, navigation } = this.props
    const { nickName } = this.state
    if(nickName) {
      try {
        this.setState({ loading: true })

        await setNickName(nickName)
        navigation.navigate('Photo')
        
      } catch(e) {

        this.setState({ loading: false })
        Alert.alert(e.toString())
      }
      
    }
    else {
      Alert.alert('請輸入暱稱')
    }
  }

  render(){
    return(
      <ImageBackground
        style={styles.bf}
        source={require('../../images/myboyfriend.jpg')}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={styles.container}>  
          <Text style={styles.title}>請輸入暱稱</Text>
          <Text style={styles.enter}>想要別人如何稱呼你/妳?</Text>
          <TextInput
            placeholder='希望大家怎麼稱呼你'
            style={styles.textInput}
            underlineColorAndroid={'transparent'}
            onChangeText={(nickName) => this.setState({nickName})}
          />
          <TouchableOpacity 
            style={styles.okBotton}
            onPress={() => this.handleSetNickName()}
          >
            <Text style={styles.okText}>確認</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
          <KeyboardAvoidingView behavior='padding'>
          </KeyboardAvoidingView> 
        </View>
        {this.state.loading ? <Overlayer /> : null }
      </ImageBackground>
    );
  }
}

export default NickName