import React from 'react'
import {
    View,
    Text,
    Alert,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Image
} from 'react-native'

import { ListItem, Button, Icon } from 'react-native-elements'

import Expo from 'expo'

import { getPopularClubData } from '../../modules/Analysis'

import { VictoryPie, VictoryContainer } from "victory-native";
import * as firebase from 'firebase'

class Analysis extends React.Component {
    state = {
        dataArray: [{x: '載入中', y: 1}],
        colorArray: ['rgb(255, 190, 0)'],
        result: false,
        refreshing: false,
        loading: true,
        primaryColor: '#f6b456',
    }

    async componentDidMount() {

        const { item } = this.props.navigation.state.params
        const { cid, club, clubData } = item
        const { avgPostViews, avgPostFavorites, avgPostComments, avgActivityViews, avgActivityFavorites } = clubData
        const dataArray = []
        const labelArray = ['A', 'B', 'C', 'D', 'E']
        let index = 0
        
        if(avgPostViews != 0) {
            dataArray.push({x: labelArray[index], y: avgPostViews})
            index++
        }
        if(avgPostFavorites != 0) {
            dataArray.push({x: labelArray[index], y: avgPostFavorites})
            index++
        }
        if(avgPostComments != 0) {
            dataArray.push({x: labelArray[index], y: avgPostComments})
            index++
        }
        if(avgActivityViews != 0) {
            dataArray.push({x: labelArray[index], y: avgActivityViews})
            index++
        }
        if(avgActivityFavorites != 0) {
            dataArray.push({x: labelArray[index], y: avgActivityFavorites})
            index++
        }

        if(dataArray.length == 0) dataArray.push({x: '無資料', y: 1})
        
        await setTimeout(() => {
            this.setState({dataArray})
        }, 1000);
        
        
    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#ff';
        for (var i = 0; i < 4; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color
    }

    getColorArray = () => {

        const colorArray = [
            '#28004d',
            '#3a006f',
            '#4b0091',
            '#5b00ae',
            '#6f00d2',
            '#8600ff',
            '#921aff',
            '#9f35ff',
            '#b15bff',
            '#be77ff',
            '#ca8eff',
            '#d3a4ff',
            '#dcb5ff',
            '#e6caff',
            '#f1e1ff',
            '#faf4ff',
        ]

        return colorArray
    }

    onRefresh = async () => {
        try {
            this.setState({refreshing: true})
            await this.searchData()
            console.log('hahaahah')
            this.setState({refreshing: false})
        } catch(e) {
            Alert.alert(e.toString())
        }
    }

    searchData = async () => {
        try {
            const { joinClub, likeClub, joinClubs, likeClubs } = this.props
            const clubDataArray = {...joinClubs, ...likeClubs}

            const clubArray = await getPopularClubData(clubDataArray)
            this.setState({clubArray, result: true})

        } catch(e) {
            console.log(e)
            throw e
        }
    }

    

    render() {
        const { item } = this.props.navigation.state.params
        const { cid, club, clubData } = item
        const {
            totalPostViews,
            totalPostFavorites,
            totalPostComments,
            totalActivityViews,
            totalActivityFavorites,
            avgPostViews,
            avgPostFavorites,
            avgPostComments,
            avgActivityViews,
            avgActivityFavorites
        } = clubData 
        return (
            <View style={{flex: 1, justifyContent:'center', backgroundColor: '#0d4273'}}>
                <View style={{flex: 1.5}}>
                    <VictoryPie
                        colorScale={[ "orange", "tomato", "gold", "cyan", "navy" ]}
                        data={this.state.dataArray}
                        animate={{duration: 2000}}
                        labelRadius={0}
                        radius={100}
                        innerRadius={0}
                        padAngle={0}
                        containerComponent={<VictoryContainer height={300}/>}
                        style={{
                            data: {
                                fillOpacity: 0.7,
                            },
                            labels: {
                                fontSize: 25,
                                fill: "#f6b456"
                            }
                        }}
                    />
                </View>            
                <View style={{
                    marginLeft: 50,
                    marginRight: 50,
                    marginBottom: 10,
                    borderRadius: 40,
                    backgroundColor: 'rgba(18, 117, 209, 0.3)',
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingTop: 10,
                    paddingBottom: 10,
                    flex: 1,
                }}
                >
                    <View style={{flex:1 ,borderWidth: 1, borderColor: 'red', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 20, height: 20, backgroundColor: 'orange', opacity: 0.8}}></View>
                        <View style={{margin: 10}}>
                            <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)'}}>貼文觀看</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`總觀看次數:${totalPostViews}`}</Text>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`平均觀看次數:${avgPostViews}`}</Text>
                        </View>
                    </View>

                    <View style={{flex:1 ,borderWidth: 1, borderColor: 'red', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 20, height: 20, backgroundColor: 'tomato', opacity: 0.8}}></View>
                        <View style={{margin: 10}}>
                            <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)'}}>貼文喜愛</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`總觀看次數:${totalPostFavorites}`}</Text>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`平均觀看次數:${avgPostFavorites}`}</Text>
                        </View>
                    </View>
                    
                </View>          
            </View>
        )
    }
}

export default Analysis


