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

import styles from '../../styles/auth/Register'

class Register extends React.Component{

  state = {
    newUser: {
      email: '',
      password: ''
    }
  }

  handleSignUp = async () => {
    const { signUpUser } = this.props
    const { newUser } = this.state

    await signUpUser(newUser)
    
  }

  render(){
    return(
      <ImageBackground
      style={styles.bf}
      source={require('../../images/myboyfriend.jpg')}
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
          />
          <Text style={styles.Q}>密碼</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.textInput}
            underlineColorAndroid={'transparent'}
            onChangeText={(password) => this.setState({newUser: {...this.state.newUser, password}})}
          />
        <TouchableOpacity 
          style={styles.okBotton}
          onPress={() => this.handleSignUp()}
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
      </ImageBackground>
    );
  }
}

export default Register