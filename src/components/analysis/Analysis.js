import React from 'react'
import {
    View,
    Text,
    Alert,
    Button,
    ScrollView
} from 'react-native'

import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme } from "victory-native";
import * as firebase from 'firebase'

class Analysis extends React.Component {
    state = {
        clubArray: [{x: '無社團', y: 1}],
        colorArray: ['rgb(255, 190, 0)'],
        radius: 10,
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
            const clubArray = []
            const clubsNum = Object.keys(joinClub).length + Object.keys(likeClub).length
            const colorArray = this.getColorArray()
            let index = 4
            Object.keys(joinClub).map((cid) => {     
                const { clubName, member } = joinClubs[cid]
                let num = Object.keys(member).length
                clubArray.push({
                    x: clubName,
                    y: num,
                    fill: colorArray[index]
                })
                index += 2
            })
            Object.keys(likeClub).map((cid) => {
                const { clubName, member } = likeClubs[cid]
                let num = Object.keys(member).length
                clubArray.push({
                    x: clubName,
                    y: num,
                    fill: colorArray[index]
                })
                index += 2
            })

            this.setState({clubArray, colorArray})

        } catch(e) {
            console.log(e)
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <ScrollView>
                    <Button title='抓資料' onPress={() => this.searchData()} />
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={10}
                        animate={{
                            duration: 2000,
                            onLoad: { duration: 1000 }
                        }}
                    >
                        <VictoryBar
                            animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 }
                            }}
                            style={{ data: { fill: "#c43a31" } }}
                            data={this.state.clubArray}
                        />
                    </VictoryChart>
                    <VictoryPie
                        data={this.state.clubArray}
                        animate={{duration: 2000}}
                        labelRadius={0}
                        radius={80}
                        style={{
                            data: {
                                fill: (data) => data.fill,
                            }
                        }}
                    />
                </ScrollView>               
            </View>
        )
    }
}

export default Analysis