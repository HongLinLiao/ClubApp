import React from 'react'
import { 
  Text, 
  View, 
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  StyleSheet,
  Keyboard
} from 'react-native';

import styles from '../../styles/auth/FogotPassword'
import Overlayer from '../common/Overlayer'
import { handleAuthError } from '../../modules/Common'


class ForgotPassword extends React.Component{

  state = {
    email: null,
    loading: false,
    texting: false,
  }

  handleSendEmail = async () => {

    try {
      if(this.state.email) {
        this.setState({loading: true})
        await this.props.sendResetMail(this.state.email)
        if(this.props.success) {
          this.props.navigation.push('SendEamilResult', {email: this.state.email})
        }
      }else {
        Alert.alert('請輸入信箱')
      }
      this.setState({loading: false})
    } catch(e) {
      this.setState({loading: false})
      const message = handleAuthError(e)
      Alert.alert(message)
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
              onFocus={() => this.setState({ texting: true })}
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
        {
          this.state.texting ?
              <TouchableOpacity style={[StyleSheet.absoluteFill]}
                  onPress={() => {
                      Keyboard.dismiss()
                      this.setState({ texting: false })
                  }}
              >
              </TouchableOpacity> : null
        }
        {this.state.loading ? <Overlayer /> : null }
      </ImageBackground>
    );
  }
}



export default ForgotPassword