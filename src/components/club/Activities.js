import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';

import styles from '../../styles/club/Activities'


class Activities extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBarPaddingIOS style={{ backgroundColor: '#f6b456' }} />
        <View style={styles.headView}>
          <View style={styles.arrowView}>
            <TouchableOpacity>
              <Image source={require('../../images/arrowLeft.png')}
                style={styles.arrow} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headText}>社遊</Text>
          <View style={styles.arrow}/>


        </View>

        <ScrollView>
        <View  style={styles.clubBackground} >
          <ImageBackground source={require('../../images/clubAct.jpg')}
            style={styles.clubBackground} />
        </View>

          <View style={styles.clubTextView}>
            <Text style={styles.clubText}>長庚大學</Text>
            <Text style={styles.clubText}>紫藤花親善社</Text>
            <TouchableOpacity>

              <Image source={require('../../images/bookmark.png')}
                style={styles.collect} />
            </TouchableOpacity>
          </View>
          <Text style={styles.actText}>社遊</Text>

          <View style={styles.summaryTextView}>
            <Image source={require('../../images/calendar.png')}
              style={styles.icon} />

            <Text style={styles.summaryText}>2018/08/17</Text>
            <Text style={styles.summaryText}>AM9:00~PM5:00</Text>
          </View>
          <View style={styles.summaryTextView}>
            <Image source={require('../../images/coin.png')}
              style={styles.icon} />
            <Text style={styles.summaryText}>自行負擔</Text>
          </View>
          <View style={styles.summaryTextView}>
            <Image source={require('../../images/place.png')}
              style={styles.icon} />
            <Text style={styles.summaryText}>淡水捷運站一號出口</Text>
          </View>

          <View style={styles.mapView}>
            <ImageBackground source={require('../../images/map.png')} resizeMode='contain'
              style={styles.map} />
          </View>

          <View style={styles.divide}>
            <Text style={styles.titleText}>活動內容</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleContentText}>bcvnasdfghjmnbvcxzascbvcnbxvcxznbcvxcnbzxvcnxbzvcnzxbvcnzxvjhsgdajshdais
              <Text style={styles.more}>...more</Text>
            </Text>

          </View>
          <View style={styles.divide}>
            <Text style={styles.titleText}>備註</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleContentText}>bcvnasdfghjmnbvcxzascbvcnbxvcxznbcvxcnbzxvcnxbzvcnzxbvcnzxvjhsgdajshdais
            <Text style={styles.more}>...more</Text>
            </Text>

          </View>

          <View style={styles.divideN}>
            <Text style={styles.titleText}>你有興趣</Text>
            <View style={styles.intrestView}>
              <View style={styles.recommendView} />
              <View style={styles.recommendView} />
            </View>
            <View style={styles.intrestView}>
              <View style={styles.recommendView} />
              <View style={styles.recommendView} />
            </View>

          </View>
        </ScrollView>
        <View style={styles.tabBar} />

      </View>
    );
  }
}

export default Activities