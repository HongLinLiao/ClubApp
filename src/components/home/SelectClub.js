import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import SelectClubElement from './SelectClubElement'

class SelectClub extends React.Component {


    componentWillUpdate () {
        console.log('haha');
    }

    render() {
        const newList = [...this.props.clubList];
        return (
            <ScrollView>
                {
                    this.props.clubList.map((element) => (
                        <SelectClubElement
                            key={element.index}
                            id={element.id}
                            name={element.name}
                            index={element.index}
                            status={element.status}
                            clubList={newList}
                            setClubStatus={this.props.setClubStatus}
                        >
                        </SelectClubElement>
                    ))
                }
            </ScrollView>
        );
    }
}

export default SelectClub