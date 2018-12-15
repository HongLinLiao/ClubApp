import React from 'react'
import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  StyleSheet,
  Keyboard
} from 'react-native';
import { CheckBox } from 'react-native-elements'
import styles from '../../styles/auth/Login'
import Overlayer from '../common/Overlayer'
import { handleAuthError } from '../../modules/Common'


class Login extends React.Component {

  componentDidMount() {

  }

  state = {
    email: '',
    password: '',
    remember: false,
    loading: false,
    texting: false,
    emailBgColor: 'rgba(255,255,255,0.4)',
    pswBgColor: 'rgba(255,255,255,0.4)',
    // goBgColor:'rgba(255,255,255,0)',
    // fbBgColor:'rgba(255,255,255,0.4)',
    // gmailBgColor:'rgba(255,255,255,0.4)',
  }

  handleLogin = async () => {
    const { navigation, signInWithEmail, dispatch } = this.props
    const { email, password, remember } = this.state

    try {
      this.setState({ loading: true })
      await signInWithEmail(email, password, remember)
    } catch (e) {

      this.setState({ loading: false })
      const message = handleAuthError(e)
      Alert.alert(message)
    }

  }

  handleFacebook = async () => {

    try {
      this.setState({ loading: true })
      await this.props.signInWithFacebook()

    } catch (e) {
      this.setState({ loading: false })
      if (e.message != '取消登入') {
        const message = handleAuthError(e)
        Alert.alert(message)
      }

    }

  }

  handleGoogle = async () => {

    try {
      this.setState({ loading: true })
      await this.props.signInWithGoogle()

    } catch (e) {
      this.setState({ loading: false })
      if (e.code != 'GOOGLE_ERROR') {
        const message = handleAuthError(e)
        Alert.alert(message)
      }

    }

  }

  render() {
    return (
      <ImageBackground
        style={styles.bf}
        source={require('../../images/backgroundImg.jpg')}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.container}>

            <View style={styles.logo}>
              <Image style={{ width: 80, height: 80, opacity: 0.5 }} source={require('../../images/logo.png')} resizeMode='contain' />
            </View>

            <View style={[styles.mail, { backgroundColor: this.state.emailBgColor }]}>

              <Image style={styles.mailIcon}
                source={require('../../images/envelope.png')} />
              <TextInput
                autoCapitalize='none'
                placeholder='abc123@iclub.com'
                placeholderTextColor='rgba(255,255,255,0.8)'
                style={styles.textInput}
                underlineColorAndroid={'transparent'}
                onChangeText={(email) => this.setState({ email })}
                onFocus={() => this.setState({ emailBgColor: 'rgba(170,170,170,0.3)', texting: true })}
                onBlur={() => this.setState({ emailBgColor: 'rgba(255,255,255,0.4)' })}
              />
            </View>

            <View style={[styles.psw, { backgroundColor: this.state.pswBgColor }]}>
              <Image style={styles.pswIcon}
                source={require('../../images/padlock.png')} />
              <TextInput
                placeholder='password'
                placeholderTextColor='rgba(255,255,255,0.8)'
                secureTextEntry={true}
                style={styles.textInput}
                underlineColorAndroid={'transparent'}
                onChangeText={(password) => this.setState({ password })}
                onFocus={() => this.setState({ pswBgColor: 'rgba(170,170,170,0.3)', texting: true })}
                onBlur={() => this.setState({ pswBgColor: 'rgba(255,255,255,0.4)' })}
              />
            </View>

            {/* <CheckBox
              center
              title='記住我'
              containerStyle={[styles.checkContainer]}
              textStyle={styles.checkText}
              checkedIcon={<Image style={styles.checkIcon}
                            source={require('../../images/check.png')}
                          />}
              uncheckedIcon={<Image style={styles.boxIcon}
                            source={require('../../images/box.png')}
                            />}
              checked={this.state.remember}
              onPress={() => this.setState({remember: !this.state.remember})}
            /> */}
            <Text></Text>
            <TouchableOpacity
              style={styles.gobotton}
              onPress={() => this.handleLogin()}
            >
              <Text style={styles.gotext}>登入</Text>
            </TouchableOpacity>
            <Text style={styles.or}>_______________  or  _______________</Text>
            <Text style={styles.signinwith}>使用其他方式登入</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.fbBotton}
                onPress={() => this.handleFacebook()}
              >
                <Image style={styles.fbIcon}
                  source={require('../../images/facebook.png')} />
                <Text style={styles.fbText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.gmailBotton}
                onPress={() => this.handleGoogle()}
              >
                <Image style={styles.gmailIcon}
                  source={require('../../images/google.png')} />
                <Text style={styles.gmailText}>Gmail</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => { this.props.navigation.push('ForgotEmail') }}
            >
              <Text style={styles.forgot}>忘記密碼?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.signupBottom} onPress={() => { this.props.navigation.push('Register') }}>
            <Text style={styles.noAccount}>還沒有帳號嗎?</Text>
            <Text style={styles.signup}>註冊</Text>
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
        {this.state.loading ? <Overlayer /> : null}
      </ImageBackground>
    );
  }
}


export default Login

