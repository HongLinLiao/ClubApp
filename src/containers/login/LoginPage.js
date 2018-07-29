import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Header, Container, Content, Item, Input, Icon, Button, Footer } from 'native-base'
import { CheckBox } from 'react-native-elements'
import { signInWithEmail, signOut } from '../../modules/Auth'
import { connect } from 'react-redux';
import * as firebase from "firebase"


class LoginPage extends React.Component {
  componentDidMount() {
    console.log('current user is', firebase.auth().currentUser)
    if(firebase.auth().currentUser) {
      this.props.navigation.navigate('App')
    }
  }
  static navigationOptions = {
    header: null
  }
  state = {
    email: '',
    password: '',
    remember: false
  }
  handleLogin = async () => {
    const { dispatch, navigation } = this.props
    await dispatch(signInWithEmail(this.state.email, this.state.password, this.state.remember))
    console.log('current user is', firebase.auth().currentUser)
    if(firebase.auth().currentUser) {
      navigation.navigate('App')
    }
  }
  render() {
    return(
      <Container style={styles.container}>
        <View style={styles.topSection}>
          <Text>123</Text>
        </View>
        <View style={styles.midSection}>
          <Item rounded style={styles.inputItem}>
            <Icon name='mail' />
            <Input 
              placeholder='abc123@iclub.com'
              onChangeText={(email) => this.setState({email})}/>
          </Item>
          <Item rounded style={styles.inputItem}>
            <Icon name='lock' />
            <Input 
              placeholder='password'
              onChangeText={(password) => this.setState({password})}
            />
          </Item>
          <CheckBox 
            center
            title='記住我'
            size={13} 
            containerStyle={styles.rememberMe} 
            textStyle={{fontSize: 13}}
            checked={this.state.remember}
            onPress={() => this.setState({remember: !this.state.remember})}
          />
          <Button full rounded bordered dark 
            style={styles.signIn}
            onPress={() => this.handleLogin()}
          >
            <Text>登入</Text>
          </Button>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button rounded primary style={styles.fb}>
              <Text style={{color: 'white'}}>Facebook</Text>
            </Button>
            <Button rounded warning style={styles.google}>
              <Text style={{color: 'white'}}>Google</Text>
            </Button>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Item>
            <Text>還沒有帳號嗎?</Text>
            <Button transparent primary
              onPress={() => {this.props.navigation.navigate('Register')}}
            >
              <Text>註冊</Text>
            </Button>
          </Item>
        </View>
      </Container>
    )
  }
}

export default connect()(LoginPage);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  topSection: {
    flex: 7,
    borderWidth: 1,
    // borderColor: 'red',
  },
  midSection: {
    flex: 18,
    borderWidth: 1,
    // borderColor: 'red',
    paddingTop: 10,
    paddingLeft: 80,
    paddingRight: 80,
  },
  bottomSection: {
    flex: 1,
    borderWidth: 1,
    // borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItem: {
    paddingLeft: 10,
    marginBottom: 20
  },
  rememberMe: {
    marginLeft: 55,
    marginRight: 55,
    marginBottom: 20,
    height: 35,
  },
  signIn: {
    marginBottom: 50,
  },
  fb: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  google: {
    paddingLeft: 20,
    paddingRight: 20,
  }
})