import React from 'react'
import { 
  Text, 
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

import styles from '../../styles/auth/SendEmailResult'

class SendEmailResult extends React.Component{

  handleSendEmail = async () => {

    const email = this.props.navigation.getParam('email', 'Null')
    if(email) {
      await this.props.sendResetMail(email)
      Alert.alert("已發送重設信件！")
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
          <Text style={styles.title}>忘記密碼</Text>
          <Text style={styles.send}>已寄信至</Text>
          <Text style={styles.mail}>{this.props.navigation.getParam('email', 'Null')}</Text>
          <TouchableOpacity 
            style={styles.againBotton}
            onPress={this.handleSendEmail}
          >
            <Text style={styles.againText}>再次發送信件</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.loginBotton}
            onPress={() => this.props.navigation.popToTop()}
          >
            <Text style={styles.loginText}>登入</Text>
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



export default SendEmailResult