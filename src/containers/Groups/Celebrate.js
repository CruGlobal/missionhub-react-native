import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Button, Flex, Text } from '../../components/common';

@connect()
@translate('groupsCelebrate')
export default class Celebrate extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Text>Load More</Text>
          <Text>LONG LIST</Text>
        </ScrollView>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={() => {}}
            text={'Input goes here'}
          />
        </Flex>
      </View>
    );
  }
}
