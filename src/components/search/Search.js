import React from 'react'
import {
    View,
    Button,
    Alert,
    Text,
    TextInput,
} from 'react-native'

import { ListItem } from 'react-native-elements'

import { searchAllClub } from '../../modules/Club'
import { searchAllClubs } from '../../modules/Data'
import Overlayer from '../common/Overlayer'


class Search extends React.Component {

    state = {
        loading: false,
        searching: false,
        text: '',
        dataArray: [],
        tempArray: [],
    }

    async componentDidMount() {
        const dataArray = await searchAllClubs()
        this.setState({dataArray})
        console.log(dataArray)
    }

    search = async () => {

        this.setState({loading: true})
        const dataArray = await searchAllClubs()
        this.setState({dataArray})
        console.log(dataArray)

        this.setState({loading: false})

    }

    handleJoinClub = async (cid) => {
        try {
            this.setState({ loading: true })

            await this.props.joinTheClub(cid)

            this.setState({ loading: false })

            Alert.alert('已成功加入!')
        } catch(e) {
            Alert.alert(e.toString())
        }
    }

    handleSearchFilter = async (text) => {

        try {
            this.setState({searching: true})

            const newText = text.replace(/\s+/g,"").split('') //去除空白並把每個字分割
            console.log(newText)

            if(newText.length != 0) {
                const newDataArray = this.state.dataArray.filter((item) => {
                    const combindName = item.schoolName + item.clubName
                    let isMatch = true
                    newText.filter((char) => {
                        let charMatch = combindName.indexOf(char) > -1
                        if(!charMatch) isMatch = false //只要有一個字不對就不列入
                    })
                    return isMatch
                })
                setTimeout(() => {
                    this.setState({searching: false, text, tempArray: newDataArray})
                }, 500)
            } else {
                this.setState({searching: false, text, tempArray: []})
            }
            
            
        } catch(e) {
            this.setState({searching: false})
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <TextInput placeholder='輸入想搜尋的學校或社團' 
                    onChangeText={(text) => this.handleSearchFilter(text)}
                    onFocus={() => this.search()}
                />
                <Text>{this.state.dataArray.length}</Text>
                <View style={{flex: 1}}>
                    {
                        this.state.tempArray.map((club, index) => (
                            <ListItem
                                key={club.cid}
                                leftAvatar={{
                                    source: {uri: club.imgUrl ? club.imgUrl : 'https://image.freepik.com/free-icon/man-dark-avatar_318-9118.jpg'},
                                    size: 'medium',
                                }}
                                title={club.schoolName + ' ' + club.clubName}
                                subtitle={club.initDate}
                                rightElement={<Button title='加入社團' onPress={() => this.handleJoinClub(club.cid)} />}
                            />
                        ))
                    }
                    {this.state.searching ? <Overlayer /> : null}
                </View>
                    
                {this.state.loading ? <Overlayer /> : null}
            </View>
        )
    }
}

export default Search