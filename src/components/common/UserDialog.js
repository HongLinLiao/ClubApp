import React from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import Overlayer from '../common/Overlayer'
import { convertClubStatus } from '../../modules/Common'


const UserDialog = ({uid, user, clubs, loading}) => {
    if(user) {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, borderRadius: 20, overflow: 'hidden'}}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f6b456',
                    }}>
                        <View style={{  width: 100, height: 100, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10}}>
                            <Image source={{ uri: user.photoUrl }} resizeMode='cover' style={{ width: 100, height: 100, }}/> 
                        </View>
                        <View>
                            <Text style={{fontSize: 25, fontWeight: 'bold', color: '#0d4273'}}>{user.nickName}</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1.5,
                        backgroundColor: '#0d4273',
                    }}>
                        <View style={{flex: 1, justifyContent: 'center',}}>
                            <Text style={{color: '#f6b456', lineHeight: 20, marginLeft: 20, marginRight: 20,}}>{user.aboutMe}</Text>
                        </View>
                        <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(18, 117, 209, 0.3)'}}>
                            <ScrollView contentContainerStyle={{paddingBottom: 20}} showsVerticalScrollIndicator={false}>
                            {
                                Object.keys(clubs).map((cid) => {
                                    const { schoolName, clubName, member } = clubs[cid]
                                    const { status } = member[uid]
                                    const _status = convertClubStatus(status)
                                    return (
                                        <View
                                            key={cid}
                                            style={{marginTop: 20}}
                                        >
                                            <Text style={{color: '#f6b456'}}>{`${schoolName} ${clubName} [${_status}]`}</Text>
                                        </View>
                                    )
                                })
                            }
                            </ScrollView>
                        </View>
                    </View>
                </View>
                {loading ? <Overlayer addStyle={{borderRadius: 20}}/> : null}
            </View>                       
        )
    } else return (
        <View style={{flex: 1}}>
            <View style={{flex: 1, borderRadius: 20, overflow: 'hidden'}}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f6b456',
                }}>
                    <View style={{  width: 100, height: 100, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10}}>
                    
                    </View>
                    <View>
                        <Text style={{fontSize: 25, fontWeight: 'bold', color: '#0d4273'}}></Text>
                    </View>
                </View>
                <View style={{
                    flex: 1.5,
                    backgroundColor: '#0d4273',
                }}>
                    <View style={{flex: 1, justifyContent: 'center',}}>
                        <Text style={{color: '#f6b456', lineHeight: 20, marginLeft: 20, marginRight: 20,}}></Text>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(18, 117, 209, 0.3)'}}>
                        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                        </ScrollView>
                    </View>
                </View>
            </View>
            {loading ? <Overlayer addStyle={{borderRadius: 20}}/> : null}
        </View>
    )
}

export default UserDialog