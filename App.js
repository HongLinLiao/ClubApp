import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootRouter from './src/routers/Router'


export default class App extends React.Component {
  render() {
    return (
      <RootRouter />
    );
  }
}


