import React from 'react'
import {
  ActivityIndicator,
  View,
  StyleSheet
} from 'react-native'


const Overlayer = ({addStyle}) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(0,0,0,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
        },
        {
          ...addStyle
        }
      ]}
    >
      <ActivityIndicator color="#fff" animating size="large" />
    </View>
  )
}


export default Overlayer