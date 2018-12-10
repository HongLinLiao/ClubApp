import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import Overlayer from '../common/Overlayer'

const UserListDialog = ({ keyList, dataList, loading, closeList, showUser, classification }) => {
    if (Object.keys(dataList).length > 0) {
        //橫向 3個一排
        let flexData = [];
        let temp = [];
        let tempNum;
        //產生二維陣列
        for (let i = 0; i < Math.ceil(dataList.length / 3); i++) {
            //清空每階層暫存
            temp = [];
            for (let j = 0; j < 3; j++) {
                tempNum = i * 3 + j;
                if (dataList[tempNum]) {
                    temp[j] = dataList[tempNum];
                }
            }
            if (temp.length > 0) {
                flexData[i] = temp.slice();
            }
        }
        let titleText = '';
        switch (classification) {
            case 'views':
                titleText = '誰看過呢？'
                break;
            case 'favorites':
                titleText = '誰按過讚呢？'
                break;
            case 'joins':
                titleText = '誰會出席這個活動呢？'
                break;
            default:
                titleText = '沒有傳入文字參數唷，請修正！'
                break;
        }

        return (
            <View style={{ flex: 1, borderRadius: 20, backgroundColor: '#0d4273' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '10%', borderRadius: 20, marginTop: '5%', marginLeft: '5%', marginRight: '5%' }}>
                    <Text style={{ fontSize: 20, color: '#FFFFFF', marginTop: '5%', }}>{titleText}</Text>
                </View>
                <ScrollView>
                    <View style={{ flex: 1, marginLeft: '8%', marginRight: '8%' }}>
                        {
                            flexData.map((child, index) => {
                                let justifyContentFlex;
                                if (child.length == 3) {
                                    justifyContentFlex = 'space-between'
                                }
                                else if (child.length == 2) {
                                    justifyContentFlex = 'space-around'
                                }
                                else if (child.length == 1) {
                                    justifyContentFlex = 'flex-start'
                                }

                                return (
                                    <View style={{ flexDirection: 'row', flex: 1, height: '25%', justifyContent: justifyContentFlex, marginTop: '5%', marginBottom: '5%' }} key={index}>
                                        {
                                            child.map((value) => (
                                                <TouchableOpacity onPress={() => {
                                                    closeList();
                                                    showUser(value.uid);
                                                }}
                                                    key={value.uid} style={{ backgroundColor: '#f6b456', borderRadius: 20, alignItems: 'center', justifyContent: 'space-around' }}>
                                                    <View style={{ margin: '2%' }}>
                                                        <Image source={{ uri: value.photoUrl }} resizeMode='cover' style={{ width: 60, height: 60, borderRadius: 30 }} />
                                                    </View>
                                                    <Text style={{ fontSize: 14, color: '#666666' }}>{value.nickName}</Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
                {loading ? <Overlayer addStyle={{ borderRadius: 20 }} /> : null}
            </View>
        );
    }
    else {
        return (
            <View style={{ flex: 1, borderRadius: 20, backgroundColor: '#0d4273', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 25 ,color:'#FFFFFF'}}>還沒有資料唷！</Text>
                {loading ? <Overlayer addStyle={{ borderRadius: 20 }} /> : null}
            </View>
        )
    }
}

export default UserListDialog