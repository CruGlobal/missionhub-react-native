import React, { Component } from 'react';
import { View, Text } from 'react-native';

import DateComponent from '../DateComponent';

/*
date
message
heart "like" icon
# of likes
 */
class MemberCelebrate extends Component {
  render() {
    const { date, message, likes } = this.props;
    return (
      <View>
        <DateComponent date={date} format="hh:mm a" />
        <Text>{message}</Text>
        <Text>{likes} likes</Text>
      </View>
    );
  }
}

export default MemberCelebrate;
