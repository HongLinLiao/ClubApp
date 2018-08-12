import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';



const defaultProps = {
  size: 'large',
  color: '#e3c4bd'
};

const Spinner = ({ size }) => (
  <View style={styles.spinnerStyle}>
    <Text style={styles.textStyle1}>ClubApp</Text>
    <Text style={styles.textStyle2}>提供最好的社團環境</Text>
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
    marginBottom: 20,
  },
  textStyle2: {
    textAlign: 'center',
    fontSize: 20,
    color: '#133d63',
    marginBottom: 40,
  }
};

Spinner.defaultProps = defaultProps;

export { Spinner };
