import React from 'react'
import { View, Text, Button, TextInput, Alert, Image,TouchableOpacity } from 'react-native'
import Overlayer from '../common/Overlayer'
import styles from '../../styles/personal/EmailReVerified'

class EmailReVerified extends React.Component {
  
  state = {
    password: '',
    loading: false
  }

  handleSendEmail = async () => {

    try {
      const { password, sendVerifiedMail, navigation } = this.props
      if(this.state.password == password) {

        this.setState({ loading: true })
        await sendVerifiedMail()

        navigation.push('SendEmailSuccessful')
  
      } else {
        Alert.alert('密碼錯誤')
      }

    } catch(e) {

      this.setState({ loading: false })
      Alert.alert('發送失敗')
    }
    
  }

  render() {
    return (
        <View style={styles.container}>
            
            <View style={styles.headView}>
                <View >
                    <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Profile')}>>
                        <Image source={require('../../images/arrowLeft.png')}
                            style={styles.arrow} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headText}>驗證電子信箱</Text>
                <View style={styles.fake}></View>
            </View>
            <View style={styles.containView}>

                <View style={styles.mailView}>
                    <Text style={styles.mailText}>電子信箱</Text>
                    <View style={styles.userMail}>
                        <Text style={styles.userMailText}>{this.props.user.email}</Text>
                    </View>
                </View>
                <View style={styles.passwordView}>
                    <Text style={styles.passwordText}>輸入登入密碼</Text>
                    <TextInput style={styles.passwordInput}
                    onChangeText={(password) => {this.setState({ password })}}
                    secureTextEntry={true}
                    underlineColorAndroid={'transparent'}></TextInput>
                </View>



                <TouchableOpacity 
                style={styles.buttonView}
                onPress={() => this.handleSendEmail()}>
                  
                    <Image source={require('../../images/send.png')}
                          style={styles.send} />
                    <Text style={styles.buttonText}>發送驗證碼</Text>
                </TouchableOpacity>

                <TouchableOpacity><Text style={styles.redText}>重新發送驗證碼</Text></TouchableOpacity>
                {this.state.loading ? <Overlayer /> : null }
            </View>

            <View style={styles.tabBar}></View>
        </View>

    );
}
}

export default EmailReVerified