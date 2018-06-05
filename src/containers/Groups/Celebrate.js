import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Button, Flex, Text } from '../../components/common';
import { getGroupCelebrateFeed } from '../../actions/celebration';

@connect()
@translate('groupsCelebrate')
export default class Celebrate extends Component {
  componentDidMount() {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  }

  render() {
    return (
      <Flex value={1}>
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
      </Flex>
    );
  }
}
