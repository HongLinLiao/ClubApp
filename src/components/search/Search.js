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
        allClubs: null,
        loading: false,
        text: '',
        dataArray: [],
        tempArray: [],
    }

    async componentDidMount() {
        const dataArray = await searchAllClubs()
        this.setState({dataArray})
    }

    search = async () => {
        this.setState({ loading: true })
        const clubsData = await searchAllClub()

        this.setState({allClubs: clubsData})

        this.setState({ loading: false })

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
            const newDataArray = this.state.dataArray.filter((item) => {
                const combindName = item.schoolName + item.clubName
                const isMatch = combindName.indexOf(text) > -1
                return isMatch
            })
            this.setState({ text, tempArray: newDataArray })
            
            
        } catch(e) {

        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Button title='查詢' onPress={this.search} />
                <TextInput placeholder='輸入想搜尋的學校或社團' onChangeText={(text) => this.handleSearchFilter(text)}/>
                {this.state.allClubs ?
                    Object.keys(this.state.allClubs).map((cid, index) => {
                        let club = this.state.allClubs[cid]
                        return (
                            <ListItem
                                key={cid}
                                leftAvatar={{
                                    source: {uri: club.imgUrl ? club.imgUrl : 'https://image.freepik.com/free-icon/man-dark-avatar_318-9118.jpg'},
                                    size: 'medium',
                                }}
                                title={club.schoolName + ' ' + club.clubName}
                                subtitle={club.initDate}
                                rightElement={<Button title='加入社團' onPress={() => this.handleJoinClub(cid)} />}
                            />
                        )
                    }) : null
                }
                <Text>{this.state.dataArray.length}</Text>
                {
                    this.state.tempArray.map((item, index) => (
                        <ListItem
                            key={item.cid}
                            title={item.schoolName + ' ' + item.clubName}
                        />
                    ))
                }
                    
                {this.state.loading ? <Overlayer /> : null}
            </View>
        )
    }
}

export default Search