import React from 'react'
import { StyleSheet, Text, View, Alert, Button } from 'react-native'
import { signOut } from '../../modules/Auth'
import { connect } from 'react-redux'


class HomePage extends React.Component {
  handleLogOut = async () => {
    await this.props.dispatch(signOut())
    this.props.navigation.navigate('Auth')
  }
  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <Text style={{fontSize: 50}}>Welcome To Home</Text>
        <Button title='Log out' onPress={()=>this.handleLogOut()}/>
      </View>
    )
  }
}

export default connect()(HomePage)