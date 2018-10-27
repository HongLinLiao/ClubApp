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
        dataArray: [{x: 0, y: 1, fill: '#005aaf'}],
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
        const labelArray = ['1', '2', '3', '4', '5']
        const colorScale = [ "orange", "tomato", "gold", "cyan", "navy" ]
        let index = 0
        
        if(avgPostViews != 0) {
            dataArray.push({x: labelArray[index], y: avgPostViews, fill: "orange",})
            index++
        }
        if(avgPostFavorites != 0) {
            dataArray.push({x: labelArray[index], y: avgPostFavorites, fill: "tomato", })
            index++
        }
        if(avgPostComments != 0) {
            dataArray.push({x: labelArray[index], y: avgPostComments, fill: "gold",})
            index++
        }
        if(avgActivityViews != 0) {
            dataArray.push({x: labelArray[index], y: avgActivityViews, fill: "green",})
            index++
        }
        if(avgActivityFavorites != 0) {
            dataArray.push({x: labelArray[index], y: avgActivityFavorites, fill: "cyan",})
            index++
        }

        if(dataArray.length == 0) dataArray.push({x: 0, y: 1, fill: '#003363'})
        
        setTimeout(() => {
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
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <VictoryPie
                        data={this.state.dataArray}
                        animate={{duration: 1000}}
                        labelRadius={60}
                        innerRadius={0}
                        padAngle={0}
                        width={330}
                        height={330}
                        labels={(data) => ''}
                        style={{
                            data: {
                                fillOpacity: 0.8,
                                fill: (data) => data.fill
                            },
                            labels: {
                                fontSize: 30,
                                fill: "#0d4273"
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
                    <View style={{flex:1 , flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 20, height: 20, backgroundColor: 'orange', opacity: 0.8}}></View>
                        <View style={{margin: 10}}>
                            <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)'}}>貼文觀看</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`總觀看次數:${totalPostViews}`}</Text>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`平均觀看次數:${avgPostViews}`}</Text>
                        </View>
                    </View>

                    <View style={{flex:1 , flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 20, height: 20, backgroundColor: 'tomato', opacity: 0.8}}></View>
                        <View style={{margin: 10}}>
                            <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)'}}>貼文喜愛</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`總喜愛次數:${totalPostFavorites}`}</Text>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`平均喜歡次數:${avgPostFavorites}`}</Text>
                        </View>
                    </View>

                    <View style={{flex:1 , flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 20, height: 20, backgroundColor: 'gold', opacity: 0.8}}></View>
                        <View style={{margin: 10}}>
                            <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)'}}>貼文留言</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`總留言次數:${totalPostComments}`}</Text>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`平均留言次數:${avgPostComments}`}</Text>
                        </View>
                    </View>

                    <View style={{flex:1 , flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 20, height: 20, backgroundColor: 'green', opacity: 0.8}}></View>
                        <View style={{margin: 10}}>
                            <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)'}}>活動觀看</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`總觀看次數:${totalActivityViews}`}</Text>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`平均觀看次數:${avgActivityViews}`}</Text>
                        </View>
                    </View>

                    <View style={{flex:1 , flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 20, height: 20, backgroundColor: 'cyan', opacity: 0.8}}></View>
                        <View style={{margin: 10}}>
                            <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)'}}>活動喜愛</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`總喜愛次數:${totalActivityFavorites}`}</Text>
                            <Text style={{fontSize: 10, color: 'rgb(255, 199, 81)'}}>{`平均喜愛次數:${avgActivityFavorites}`}</Text>
                        </View>
                    </View>
                    
                </View>          
            </View>
        )
    }
}

export default Analysis


