import React from 'react'
import {
    View,
    Text,
    Alert,
    Button,
} from 'react-native'

import { VictoryPie } from "victory-native";
import * as firebase from 'firebase'

class Analysis extends React.Component {
    state = {
        clubArray: [{x: '無社團', y: 1}],
        colorArray: ['rgb(255, 190, 0)']
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

    randomColor = () => {

        let r = 255
        //g => 180 ~ 230
        let g = Math.floor(Math.random() * 41 + 190 )
        //b => 0 ~ 160
        let b = Math.floor(Math.random() * 161 )

        let color = `rgb(${r}, ${g}, ${b})`

        return color
    }


    searchData = async () => {
        try {
            const { joinClub, likeClub, joinClubs, likeClubs } = this.props
            const clubArray = []
            const clubsNum = Object.keys(joinClub).length + Object.keys(likeClub).length
            const colorArray = []
            let r = 255
            let g = 210
            let b = 0
            let bInterval = Math.floor((130 - 0) / clubsNum)
            for(let i = 0; i < clubsNum; i++) {
                b = b + bInterval
                colorArray.push(`rgb(${r}, ${g}, ${b})`)
            }
            let index = 0
            Object.keys(joinClub).map((cid) => {     
                const { clubName, member } = joinClubs[cid]
                let num = Object.keys(member).length
                clubArray.push({
                    x: clubName,
                    y: num,
                    fill: colorArray[index]
                })
                index++
            })
            Object.keys(likeClub).map((cid) => {
                const { clubName, member } = likeClubs[cid]
                let num = Object.keys(member).length
                clubArray.push({
                    x: clubName,
                    y: num,
                    fill: colorArray[index]
                })
                index++
            })

            console.log(clubsNum)
            console.log(colorArray)
            console.log(clubArray)
            

            this.setState({clubArray, colorArray})

        } catch(e) {
            console.log(e)
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <Button title='抓資料' onPress={() => this.searchData()} />
                <VictoryPie
                    data={this.state.clubArray}
                    animate={{duration: 2000}}
                    labelRadius={80}
                    style={{
                        data: {
                            fill: (d) => d.fill,
                        }
                    }}
                />
            </View>
        )
    }
}

export default Analysis