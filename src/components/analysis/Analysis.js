import React from 'react'
import {
    View,
    Text,
    Alert,
    Button,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Image
} from 'react-native'

import { ListItem } from 'react-native-elements'

import Expo from 'expo'

import { getPopularClubData } from '../../modules/Analysis'

import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme, VictoryLabel, VictoryAxis } from "victory-native";
import * as firebase from 'firebase'

class Analysis extends React.Component {
    state = {
        clubArray: [{x: '無社團', y: 1}],
        colorArray: ['rgb(255, 190, 0)'],
        radius: 10,
        result: false,
        refreshing: false,
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


    searchData = async () => {
        try {
            const { joinClub, likeClub, joinClubs, likeClubs } = this.props
            const clubDataArray = {...joinClubs, ...likeClubs}

            const clubArray = await getPopularClubData(clubDataArray)
            this.setState({clubArray, result: true})

        } catch(e) {
            console.log(e)
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center', backgroundColor: '#0d4273', paddingBottom: 30}}>
                <Button title='分析社團' onPress={() => this.searchData()} />
                    {this.state.result ? (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => {}}
                                />
                            }
                        >
                            <VictoryChart
                                theme={VictoryTheme.material}
                                domainPadding={10}
                                animate={{
                                    duration: 3000,
                                    onLoad: { duration: 1000 }
                                }}
                                domainPadding={{ x: 20 }}
                            >
                                <VictoryBar
                                    animate={{
                                        duration: 3000,
                                        onLoad: { duration: 1000 }
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
                                        tickLabels: {fontSize: 10, padding: 5},
                                        ticks: {stroke: "#f6b456", size: 5},
                                        tickLabels: {fontSize: 15, padding: 5, fill: '#f6b456'}
                                    }}
                                    tickFormat={(t) => Math.round(t)}
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
                                borderRadius: 40,
                                backgroundColor: 'rgba(18, 117, 209, 0.3)',
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingTop: 10,
                                paddingBottom: 10,
                            }}
                            >
                                {this.state.clubArray.map((item, index) => {
                                    const { club } = item
                                    return (
                                        <TouchableOpacity key={index} onPress={() => {} }>
                                            <ListItem
                                                key={index}
                                                leftAvatar={{
                                                    source: {uri: club.imgUrl ? club.imgUrl : 'https://image.freepik.com/free-icon/man-dark-avatar_318-9118.jpg'},
                                                    size: 'medium',
                                                }}
                                                title={club.schoolName + ' ' + club.clubName}
                                                subtitle={club.initDate}
                                                titleStyle={{color: '#f6b456'}}
                                                subtitleStyle={{color: '#f6b456'}}
                                                containerStyle={{backgroundColor: null}}
                                            />
                                        </TouchableOpacity>
                                    )
                                })
                                }
                            </View>
                        </ScrollView>
                    ) : null  
                    }            
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