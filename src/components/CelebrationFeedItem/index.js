import React, { Component } from 'react';
import { View, Text } from 'react-native';

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
        <Text>{date}</Text>
        <Text>{message}</Text>
        <Text>{likes} likes</Text>
      </View>
    );
  }
}

export default MemberCelebrate;
