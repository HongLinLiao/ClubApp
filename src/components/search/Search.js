import React from 'react'
import {
    View,
    Button,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native'

import { ListItem } from 'react-native-elements'

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
        // const dataArray = await searchAllClubs()
        // this.setState({dataArray})
        // console.log(dataArray)
    }

    search = async () => {

        this.setState({loading: true})
        const dataArray = await searchAllClubs()
        this.setState({dataArray})
        console.log(dataArray)

        this.setState({loading: false})

    }

    handleLikeTheClub = async (cid) => {
        try {
            this.setState({ loading: true })

            await this.props.likeTheClub(cid)

            this.setState({ loading: false })

            Alert.alert('已成功收藏!')
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
                this.setState({text, tempArray: newDataArray})
                setTimeout(() => {
                    this.setState({searching: false})
                }, 500)
            } else {
                this.setState({searching: false, text, tempArray: []})
            }
            
            
        } catch(e) {
            this.setState({searching: false})
        }
    }

    handleGoToClub = async (club, status) => {
        try {
            const { setCurrentClub } = this.props

            if(status.hasJoin) {
                setCurrentClub(club.cid)
                this.props.navigation.navigate('ClubRouter')
            } else {
                this.props.navigation.push('SearchClub', {club, status})
            }
            

        } catch(e) {
        }
    }

    filterClubStatus = (club) => {
        const { joinClub, likeClub } = this.props
        const joinClubCids = Object.keys(joinClub)
        const likeClubCids = Object.keys(likeClub)

        let hasJoin = false
        let hasLike = false
        joinClubCids.map((cid) => {
            if(club.cid == cid) hasJoin = true
        })
        likeClubCids.map((cid) => {
            if(club.cid == cid) hasLike = true
        })

        return { hasJoin, hasLike }
    }


    render() {

        return (
            <View style={{flex: 1}}>
                <TextInput placeholder='輸入想搜尋的學校或社團' 
                    onChangeText={(text) => this.handleSearchFilter(text)}
                    onFocus={() => this.search()}
                />
                {
                    // <Text>{this.state.dataArray.length}</Text>
                }
                <View style={{flex: 1}}>
                    {
                        this.state.tempArray.map((club, index) => {
                            const status = this.filterClubStatus(club)

                            return (
                                <TouchableOpacity key={club.cid} onPress={() => this.props.navigation.push('SearchClub', {club, status})}>
                                    <ListItem
                                        key={club.cid}
                                        leftAvatar={{
                                            source: {uri: club.imgUrl ? club.imgUrl : 'https://image.freepik.com/free-icon/man-dark-avatar_318-9118.jpg'},
                                            size: 'medium',
                                        }}
                                        title={club.schoolName + ' ' + club.clubName}
                                        subtitle={club.initDate}
                                        rightElement={
                                            status.hasJoin ? <Text>已加入社團</Text> :
                                            status.hasLike ? <Text>已收藏社團</Text> :
                                                    <Button title='收藏社團' onPress={() => this.handleLikeTheClub(club.cid)} />
                                        }
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                    {this.state.searching ? <Overlayer /> : null}
                </View>
                    
                {this.state.loading ? <Overlayer /> : null}
            </View>
        )
    }
}

export default Search