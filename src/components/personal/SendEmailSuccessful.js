import React from 'react'
import { View, Text, Button,Image, TouchableOpacity  } from 'react-native'
import styles from '../../styles/personal/SendEmailSuccessful';
class SendEmailSuccessful extends React.Component {

  render() {
    return (
      <View style={styles.container}>
      
      <View style={styles.containView}>

          <Image source={require('../../images/images2/complete.jpg')}
              style={styles.completeImage} />


          <View style={styles.mailView}>
              <Text style={styles.mailText}>信件已寄送至</Text>
              <View style={styles.userMail}>
                  <Text style={styles.userMailText}>{this.props.user.email}</Text>
              </View>
              <View style={styles.buttonView}>
                      <TouchableOpacity onPress={() => this.props.navigation.pop(2)}>
                      <Text style={{color:'#666666',fontSize:18}}>確認</Text>
                      </TouchableOpacity>
              </View>
          </View>
      </View>
  </View>
    )
  }
}

export default SendEmailSuccessful