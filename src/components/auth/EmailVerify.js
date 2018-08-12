import React from 'react'
import { 
  Text, 
  View, 
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

import styles from '../../styles/auth/EmailVerify'

class EmailVerify extends React.Component{


  handleSendEmail = async () => {

    await this.props.sendVerifiedMail()

  }

  verify = async () => {
    const { emailVerified } = this.props

    await emailVerified() //重新載入使用者和更新state

  }

  dontAsk = () => {

    this.props.setVerifyEmailAgain(false) //更新UserState
    
  }

  render(){
    return(
  <ImageBackground
    style={styles.bf}
    source={require('../../images/myboyfriend.jpg')}
    imageStyle={{ resizeMode: 'cover' }}
  > 
    <View style={styles.container}> 
      <Text style={styles.title}>您尚未驗證信箱</Text>
      <Text style={styles.send}>您的信箱為</Text>
      <Text style={styles.mail}>{this.props.user.email}</Text>
      <TouchableOpacity 
        style={styles.againBotton}
        onPress={this.handleSendEmail}
      >
        <Text style={styles.againText}>發送驗證信</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.loginBotton}
        onPress={this.verify}
      >
        <Text style={styles.loginText}>驗證</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.dontAsk}
      >
        <Text style={styles.backText}>稍後驗證</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView behavior='padding'>
      </KeyboardAvoidingView> 
    </View>
  </ImageBackground>
    );
  }
}



export default EmailVerify