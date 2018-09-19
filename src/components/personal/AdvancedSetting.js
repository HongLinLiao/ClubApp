import React from 'react'
//import { View, Text, Button, TextInput, Image } from 'react-native'
import { Text, View, StyleSheet ,ScrollView,TouchableOpacity,Image, StatusBar,TextInput} from 'react-native';
import {Icon, SearchBar, Button} from 'react-native-elements'
import { Constants } from 'expo';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';


import styles from '../../styles/personal/AdvancedSetting'
//import Overlayer from '../common/Overlayer'

class AdvancedSetting extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <StatusBarPaddingIOS style={{backgroundColor: '#f6b456'}}/>
        
        <View style={styles.headView}>
            <View>
                <TouchableOpacity>
                <Image source={require('../../images/arrowLeft.png')}
                style={styles.arrow}/>
                </TouchableOpacity>
            </View>
            <Text style={styles.headText}>進階管理</Text>
            <View style={styles.fake}></View>
            </View>

        <View style={styles.containView}>
        <View style={styles.boxView}>
            <Text style={styles.boxFirstText}>驗證</Text> 
            <Text style={styles.redText}>(已驗證)</Text> 
            <View style={styles.fake}></View>
            <View style={styles.fake}></View>
            <Text style={styles.mailText}>qwertas@gmail.com</Text>
            <View>
                <TouchableOpacity
                onPress={() => this.props.navigation.navigate('EmailReVerified')}>
                <Image source={require('../../images/arrowRight.png')}
                style={styles.arrowRight}/>
                
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.boxView}>
        <Text style={styles.boxText}>電子信箱</Text>  
        <View>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ChangeEamil')}>
            <Image source={require('../../images/arrowRight.png')}
            style={styles.arrowRight}/> 
            
            </TouchableOpacity>
        </View>
        </View>


        <View style={styles.boxBottomBorderView}>
        <Text style={styles.boxText}>密碼</Text>  
        <View>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ChangePassword')}>
            <Image source={require('../../images/arrowRight.png')}
            style={styles.arrowRight}/>
            </TouchableOpacity>
        </View>
        </View>

        <View style={styles.boxView}>
        <Text style={styles.boxText}>關於我們</Text>  
        </View>

      </View>
      <View style={styles.tabBar}></View>  
    </View>  
  );
  }
}


export default AdvancedSetting