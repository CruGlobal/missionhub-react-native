import React, { Component } from 'react';
import { translate } from 'react-i18next';

import { Text, Flex } from '../../components/common';

export default class EmptyCelebrateFeed extends Component {
  render() {
    return (
      <Flex>
        <Text>Celebrate!</Text>
        <Text>You can celebrate someone's Steps of Faith here.</Text>
      </Flex>
    );
  }
}
