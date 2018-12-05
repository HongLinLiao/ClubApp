import React from 'react'
import { View, Text, TextInput, Alert, TouchableOpacity} from 'react-native'
import Overlayer from '../common/Overlayer'
import styles from '../../styles/personal/ChangePassword'

class ChangePassword extends React.Component {

  state = {
    oldPassword: '',
    newPassword: '',
    newPasswordAgain: '',
    loading: false
  }

  handleSavePassword = async () => {

    try {
      const { oldPassword, newPassword, newPasswordAgain } = this.state
      const { user, password, updateUserPassword, navigation } = this.props

      if (oldPassword && newPassword && newPasswordAgain) {
        if (oldPassword == password) {
          if (newPassword == newPasswordAgain) {
            this.setState({ loading: true })
            await updateUserPassword(oldPassword, newPassword)
            Alert.alert('密碼更改成功!')
            navigation.pop()
          } else {
            Alert.alert('新密碼與確認密碼不相同')
          }
        } else {
          Alert.alert('舊密碼錯誤')
        }
      } else {
        Alert.alert('請勿空白')
      }

    } catch (e) {

      this.setState({ loading: false })
      Alert.alert(e.toSring())
    }

  }

  render() {
    return (
      <View style={styles.container}>    
        <View style={[styles.main]}>
          <View style={styles.containView}>

            <View style={styles.passwordView}>
              <Text style={styles.passwordText}>輸入原密碼</Text>
              <TextInput
                onChangeText={(oldPassword) => { this.setState({ oldPassword }) }}
                style={styles.passwordInput}
                underlineColorAndroid={'transparent'}
                secureTextEntry={true}
                ></TextInput>
            </View>

            <View style={styles.newPasswordView}>
              <Text style={styles.newPasswordText}>輸入新密碼</Text>
              <TextInput
                onChangeText={(newPassword) => { this.setState({ newPassword }) }}
                style={styles.newPasswordInput}
                underlineColorAndroid={'transparent'}
                secureTextEntry={true}
                ></TextInput>
            </View>

            <View style={styles.newPasswordAgainView}>
              <Text style={styles.newPasswordAgainText}>再次輸入新密碼</Text>
              <TextInput
                onChangeText={(newPasswordAgain) => { this.setState({ newPasswordAgain }) }}
                style={styles.newPasswordAgainInput}
                underlineColorAndroid={'transparent'}
                secureTextEntry={true}
              >
              </TextInput>
            </View>
            <TouchableOpacity style={[styles.buttonView]} onPress={this.handleSavePassword}>
              <Text style={styles.button}>確定變更</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.loading ? <Overlayer /> : null}
      </View>
    );
  }
}
export default ChangePassword




