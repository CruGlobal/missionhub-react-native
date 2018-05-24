import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Text } from '../../components/common';

@connect()
@translate('groupsMembers')
export default class Members extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Text>Members List</Text>
          <Text>Load More</Text>
        </ScrollView>
      </View>
    );
  }
}
