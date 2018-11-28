import React from 'react'
import { 
  Text, 
  View, 
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert
} from 'react-native';

import styles from '../../styles/auth/FogotPassword'

class ForgotPassword extends React.Component{

  state = {
    email: ''
  }

  handleSendEmail = async () => {

    if(this.state.email) {
      await this.props.sendResetMail(this.state.email)
      if(this.props.success) {
        this.props.navigation.push('SendEamilResult', {email: this.state.email})
      } 
      else {
        Alert.alert('輸入錯誤！')
      }
    }
    else {
      Alert.alert('請輸入信箱')
    }

  }

  render(){
    return(
      <ImageBackground
      style={styles.bf}
      source={require('../../images/backgroundImg.jpg')}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={styles.container}> 
        <Text style={styles.title}>請輸入您的信箱</Text>
        <View style={styles.mail}>
          <Image style={styles.mailIcon}
            source={require('../../images/envelope.png')}/>
          <TextInput
            placeholder='abc123@iclub.com'
            placeholderTextColor='rgba(255,255,255,0.8)'
            style={styles.textInput}
            underlineColorAndroid={'transparent'}
            onChangeText={(email) => this.setState({email})}
          />       
        </View>
        <TouchableOpacity 
          style={styles.loginBotton}
          onPress={this.handleSendEmail}
        >
          <Text style={styles.loginText}>發送</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
        >
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
        <KeyboardAvoidingView behavior='padding'>
        </KeyboardAvoidingView> 
      </View>
      </ImageBackground>
    );
  }
}



export default ForgotPassword