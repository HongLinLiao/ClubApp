import React from 'react'
import { 
  Text, 
  View, 
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StyleSheet,
  Keyboard
} from 'react-native';

import styles from '../../styles/auth/Register'
import Overlayer from '../common/Overlayer'
import { handleAuthError } from '../../modules/Common'



class Register extends React.Component{

  state = {
    newUser: {
      email: null,
      password: null,
    },
    _password: '',
    loading: false,
    texting: false
  }

  handleSignUp = async () => {
    const { signUpUser } = this.props
    const { newUser } = this.state

    try {
      this.setState({ loading: true })
      await signUpUser(newUser)

      Alert.alert('註冊成功(自動幫您登入)')
    } catch(e) {
      this.setState({ loading: false })
      const message = handleAuthError(e)
      Alert.alert(message)
    }
    
  }

  check = () => {
    const { newUser, _password} = this.state
    if(!newUser.email) {
      Alert.alert('請輸入信箱')
    } else if(!newUser.password) {
      Alert.alert('請輸入密碼')
    } else {
      if(newUser.password == _password) {
        Alert.alert('確定要以' + newUser.email + "註冊嗎？", '',
            [
              { text: '取消', onPress: () => { }, style: 'cancel' },
              { text: '確定註冊', onPress: () => this.handleSignUp() },
            ],
            { cancelable: false }
        )
      } else {
        Alert.alert("驗證密碼錯誤!")
      }
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
          
          <Text style={styles.title}>註 冊</Text>
            <Text style={styles.Q}>信箱</Text>
            <TextInput
              autoCapitalize='none'
              placeholder='abc123@iclub.com'
              placeholderTextColor='rgba(255,255,255,0.7)'
              style={styles.textInput}
              underlineColorAndroid={'transparent'}
              onChangeText={(email) => this.setState({newUser: {...this.state.newUser, email}})}
              onFocus={() => this.setState({ texting: true })}
            />
            <Text style={styles.Q}>密碼</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.textInput}
              underlineColorAndroid={'transparent'}
              onChangeText={(password) => this.setState({newUser: {...this.state.newUser, password}})}
              onFocus={() => this.setState({ texting: true })}
            />
            <Text style={styles.Q}>再次輸入密碼</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.textInput}
              underlineColorAndroid={'transparent'}
              onChangeText={(_password) => this.setState({_password})}
              onFocus={() => this.setState({ texting: true })}
            />
          <TouchableOpacity 
            style={styles.okBotton}
            onPress={() => this.check()}
          >
            <Text style={styles.okText}>確認</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.backText}>回到登入頁面</Text>
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

export default Register