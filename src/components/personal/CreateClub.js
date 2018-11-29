import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import styles from '../../styles/personal/CreateClub';


class CreateClub extends React.Component {
    state = {
        school: '',
        clubName: '',
    }

    nextStep = () => {
        if (this.state.school && this.state.clubName)
            this.props.navigation.push('ClubPrivateSetting', { school: this.state.school, clubName: this.state.clubName })
        else
            Alert.alert('請勿空白')
    }

    render() {
        return (
                <View style={styles.container}>
                    <Text style={styles.title}>請輸入您的社團名稱</Text>
                    <Text style={styles.Q}>學校</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='長庚大學'
                        placeholderTextColor='rgba(102,102,102,0.5)'
                        underlineColorAndroid={'transparent'}
                        onChangeText={(school) => this.setState({ school })} />
                    <Text style={styles.Q}>社團名稱</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='長庚歷史研究社'
                        placeholderTextColor='rgba(102,102,102,0.5)'
                        underlineColorAndroid={'transparent'}
                        onChangeText={(clubName) => this.setState({ clubName })} />
                    <TouchableOpacity onPress={() => this.nextStep()}>
                        <Text style={styles.nextText}>下一步</Text>
                    </TouchableOpacity>
                </View>
        );
    }
}
export default CreateClub