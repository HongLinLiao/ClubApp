import React from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';



const defaultProps = {
  size: 'large',
  color: '#e3c4bd'
};

const Spinner = ({ size }) => (
  <View style={styles.spinnerStyle}>
    <Image style={{width: 125, height: 300}} source={require('../../images/logo2.png')}/>
    
    <Text style={styles.textStyle2}>提供最優質的社團環境</Text>
    <ActivityIndicator size='large' color='#133d63'/>
  </View>
);

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdc59b',
  },
  textStyle1: {
    textAlign: 'center',
    fontSize: 50,
    color: '#133d63',
    marginTop: 20,
    marginBottom: 20,
  },
  textStyle2: {
    textAlign: 'center',
    fontSize: 20,
    color: '#133d63',
    marginTop: 20,
    marginBottom: 40,
  }
};

Spinner.defaultProps = defaultProps;

export { Spinner };
