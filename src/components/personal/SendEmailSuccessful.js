import React from 'react'
import { View, Text, Button,Image } from 'react-native'
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
                  <Button title='確認' onPress={() => this.props.navigation.pop(2)}
                      title='確認'
                      color='#666666'
                      backgroundColor='#fbdaa7'
                      borderRadius={10}
                      buttonStyle={styles.button} />
              </View>
          </View>
      </View>
  </View>
    )
  }
}

export default SendEmailSuccessful