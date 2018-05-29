import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Text, Flex } from '../../components/common';

@connect()
@translate('groupsSurveys')
export default class Surveys extends Component {
  render() {
    return (
      <Flex value={1}>
        <ScrollView style={{ flex: 1 }}>
          <Text>LONG LIST</Text>
          <Text>Load More</Text>
        </ScrollView>
      </Flex>
    );
  }
}
