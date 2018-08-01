import React from 'react';
import { View, ActivityIndicator } from 'react-native';



const defaultProps = {
  size: 'large',
};

const Spinner = ({ size }) => (
  <View style={styles.spinnerStyle}>
    <ActivityIndicator size={size} />
  </View>
);

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

Spinner.defaultProps = defaultProps;

export { Spinner };
