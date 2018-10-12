import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import styles from '../../styles/personal/ClubPrivateSetting';


class ClubPrivateSetting extends React.Component {
    state = {
        open: false
    }

    alert = () => {
        let open = this.state.open ? '公開' : '非公開'
        Alert.alert('建立社團', '確定要建立社團(' + open + ')',
            [
                { text: '取消建立', onPress: () => console.log('取消建立'), style: 'cancel' },
                { text: '建立', onPress: () => this.create() },
            ],
            { cancelable: false }
        )
    }

    create = async () => {
        try {
            const { navigation, createClub } = this.props
            const { getParam, popToTop, navigate } = navigation

            await createClub(getParam('school'), getParam('clubName'), this.state.open)

            popToTop()
            navigate('ClubRouter')

        } catch (e) {
            Alert.alert(e.toString())
        }

    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>將您的社團設為</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.botton}
                        onPress={() => {
                            this.setState({ open: false })
                            Alert.alert('設為非公開')
                        }}>
                        <Text style={styles.bottonText}>非公開</Text>
                        <Image source={require('../../images/graylocked.png')}
                            style={styles.lockIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botton}
                        onPress={() => {
                            this.setState({ open: true })
                            Alert.alert('設為公開')
                        }}>
                        <Text style={styles.bottonText}>公開</Text>
                        <Image source={require('../../images/grayunlocked.png')}
                            style={styles.unlockIcon} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.okBotton} onPress={() => this.alert() }>
                    <Text style={styles.okText}>建立</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default ClubPrivateSetting