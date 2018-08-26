import React from 'react'
import { View } from 'react-native'
import { CheckBox, ListItem } from 'react-native-elements'

class Notification extends React.Component {

  state = {
    loading: false,
    globalChecked: true,
    nightModeChecked: false,
    clubList: [
      {clubName: '熱舞社', schoolName: '長庚大學', on: false}, 
      {clubName: '吉他社', schoolName: '長庚大學', on: true},
      {clubName: '紫藤花親善社', schoolName: '長庚大學', on: true},
      {clubName: '跆拳道社', schoolName: '長庚大學', on: false},
      {clubName: 'xxxx社', schoolName: '長庚大學', on: true},
    ],
  }

  setGlobal = async () => {

  }

  setNight = async () => {

  }

  setClub = async (index, on) => {

    let list = this.state.clubList
    let club = list[index]
    list.splice(index, 1, {...club, on: !on})
    this.setState({
      clubList: list
    })

    
  }

  render() {
    return (
      <View>
        <ListItem
          title='提醒'
          switch={{value: this.state.globalChecked, onValueChange: () => this.setState({globalChecked: !this.state.globalChecked}) }}
        />
        <ListItem
          title='夜間模式'
          switch={{value: this.state.nightModeChecked, onValueChange: () => this.setState({nightModeChecked: !this.state.nightModeChecked}) }}          
        />
        {this.state.clubList.map((item, index) => (
          <ListItem
            title={ item.schoolName + '  ' + item.clubName }
            key={index}
            switch={{value: item.on, onValueChange: () => this.setClub(index, item.on), disabled: this.state.globalChecked}}
          />
        ))}
      </View>
    )
  }
}

export default Notification