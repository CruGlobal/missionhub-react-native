import React, { Component } from 'react';

import { Card, Text, Flex, IconButton } from '../../components/common';

import styles from './styles';

export default class Celebrate extends Component {
  onPressLikeIcon = () => {};

  render() {
    return (
      <Card style={styles.row}>
        <Flex value={1} direction={'row'}>
          <Flex value={1} direction={'column'}>
            <Text>{'first name'.toUpperCase()}</Text>
            <Text>{'3:23 PM'}</Text>
            <Text>
              descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription
            </Text>
          </Flex>
          <Flex direction={'row'}>
            <Text>3</Text>
            <IconButton
              name="starIcon"
              type="MissionHub"
              onPress={this.onPressLikeIcon}
              style={styles.icon}
            />
          </Flex>
        </Flex>
      </Card>
    );
  }
}
