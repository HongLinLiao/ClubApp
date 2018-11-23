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

import { getPopularClubData, getClubDetailsData } from '../../modules/Analysis'
import Overlayer from '../common/Overlayer'

import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme, VictoryLabel, VictoryAxis } from "victory-native";
import * as firebase from 'firebase'

class Analysis extends React.Component {
    state = {
        clubArray: [{x: '無社團', y: 1}],
        tickValues: ['無社團'],
        colorArray: ['rgb(255, 190, 0)'],
        radius: 10,
        result: false,
        refreshing: false,
        loading: false,
    }

    async componentDidMount() {

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
            console.log(e.toString())
        }
    }

    searchData = async () => {
        try {
            const { joinClub, likeClub, joinClubs, likeClubs } = this.props
            const clubDataArray = {...joinClubs, ...likeClubs}
            const tickValues = []

            const clubArray = await getPopularClubData(clubDataArray)
            clubArray.map((item) => {
                tickValues.push(item.x)
            })
            this.setState({clubArray, tickValues, result: true})

        } catch(e) {
            Alert.alert(e.toString())
        }
    }

    handelGoToDetails = async (item) => {
        try {
            this.setState({loading: true})

            this.props.navigation.push('AnalysisDetails', {item})

            this.setState({loading: false})
        } catch(e) {
            Alert.alert(e.toString())
        }
    }

    render() {
        const {  joinClub, likeClub } = this.props
        const clubNum = Object.keys(joinClub).length + Object.keys(likeClub).length
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center', backgroundColor: '#0d4273'}}>
                {this.state.result ? 
                    (
                        <View style={{alignSelf: 'stretch', backgroundColor: 'rgba(24, 125, 219, 0.1)', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                            <Text style={{color: 'white'}}>下拉重整</Text>
                        </View>
                    ) :
                    (
                        <Button
                            icon={<Image source={require('../../images/bars-chart.png')} />}
                            disabled={clubNum == 0}
                            iconRight
                            title={clubNum == 0 ? '你沒有任何社團' : '點擊統計'}
                            titleStyle={{ fontWeight: "700", color: '#0d4273' }}
                            buttonStyle={{ paddingRight: 15 ,paddingLeft: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'rgba(246, 180, 86, 0.75)', }}
                            onPress={() => this.searchData()} 
                        />
                    )
                }
                
                {this.state.result ? (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefresh()}
                                tintColor='#f6b456'
                            />
                        }
                    >
                        <VictoryChart
                            theme={VictoryTheme.material}
                            domainPadding={10}
                            animate={{
                                duration: 3000,
                                onLoad: { duration: 2000 }
                            }}
                            domainPadding={{ x: 30 }}
                        >
                            <VictoryBar
                                animate={{
                                    duration: 3000,
                                    onLoad: { duration: 2000 }
                                }}
                                style={{
                                    data: {
                                        fill: d => d.fill,
                                    },
                                    labels: {
                                        fontSize: 15,
                                        fill: d => d.fill,
                                    }
                                }}
                                barWidth={30}
                                cornerRadius={ (data) => data.y != 0 ? 15 : 0 }
                                data={this.state.clubArray}
                                labels={(data) => data.y}
                            />
                            <VictoryAxis                               
                                style={{
                                    axis: {stroke: "#f6b456"},
                                    axisLabel: {fontSize: 20, padding: 30},
                                    grid: {stroke: null},
                                    ticks: {stroke: "#f6b456", size: 5},
                                    tickLabels: {fontSize: 15, padding: 5, fill: '#f6b456'}
                                }}
                                tickFormat={(t) => Math.round(t)}
                                tickValues={this.state.tickValues}
                            />
                            <VictoryAxis
                                dependentAxis
                                style={{
                                    grid: {stroke: null},
                                    axis: {stroke: "#f6b456"},
                                    ticks: {stroke: "#f6b456", size: 5},
                                    tickLabels: {fontSize: 15, padding: 5, fill: '#f6b456'}
                                }}
                            />
                        </VictoryChart>
                        <View style={{
                            marginLeft: 30,
                            marginRight: 30,
                            marginBottom: 30,
                            borderRadius: 40,
                            backgroundColor: 'rgba(18, 117, 209, 0.3)',
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}
                        >
                            {this.state.clubArray.map((item, index) => {
                                const { club, clubData } = item
                                return (
                                    <TouchableOpacity key={item.cid} onPress={() => this.handelGoToDetails(item) }>
                                        <ListItem
                                            key={item.cid}
                                            leftAvatar={{
                                                source: {uri: club.imgUrl ? club.imgUrl : 'https://image.freepik.com/free-icon/man-dark-avatar_318-9118.jpg'},
                                                size: 'medium',
                                                containerStyle: {marginTop: 5}
                                            }}
                                            leftElement={<Text style={{color: '#f6b456', fontWeight: 'bold'}}>{index + 1}</Text>}
                                            title={<Text style={{fontSize: 20, color: 'rgb(255, 199, 81)'}}>{club.schoolName + ' ' + club.clubName}</Text>}
                                            subtitle={
                                                <View style={{marginTop: 5}}>
                                                    <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)', marginBottom: 5}}>{`文章活躍度：${clubData.avgPostRank}`}</Text>
                                                    <Text style={{fontSize: 15, color: 'rgb(255, 199, 81)'}}>{`活動活躍度：${clubData.avgActivityRank}`}</Text>
                                                </View> 
                                            }
                                            containerStyle={{backgroundColor: null}}
                                        />
                                        {
                                            ((index + 1) != this.state.clubArray.length) ? <View style={{borderWidth: 1, borderColor: '#0d4273'}}></View> : null
                                        }
                                    </TouchableOpacity>
                                )
                            })
                            }
                        </View>
                    </ScrollView>
                ) : null  
                }
                {this.state.loading ? <Overlayer /> : null}       
            </View>
        )
    }
}

export default Analysis


// <VictoryPie
//                                 data={this.state.clubArray}
//                                 animate={{duration: 2000}}
//                                 labelRadius={0}
//                                 radius={80}
//                                 style={{
//                                     data: {
//                                         fill: (data) => data.fill,
//                                     }
//                                 }}
//                             />