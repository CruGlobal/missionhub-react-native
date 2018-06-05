import React, { Component } from 'react';

import { Card, Text, Flex, IconButton } from '../../components/common';

import styles from './styles';

export default class Celebrate extends Component {
  onPressLikeIcon = () => {};

  render() {
    return (
      <Card style={styles.card}>
        <Flex value={1} direction={'row'}>
          <Flex value={1} direction={'column'}>
            <Text style={styles.name}>{'first name'.toUpperCase()}</Text>
            <Text style={styles.time}>{'3:23 PM'}</Text>
            <Text style={styles.description}>
              descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription
            </Text>
          </Flex>
          <Flex direction={'column'} align="start">
            <Flex direction={'row'} align="center">
              <Text style={styles.likeCount}>3</Text>
              <IconButton
                name="starIcon"
                type="MissionHub"
                onPress={this.onPressLikeIcon}
                style={styles.icon}
              />
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  }
}
