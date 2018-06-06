import React, { Component } from 'react';

import { Card, Text, Flex, IconButton } from '../../components/common';

import styles from './styles';

export default class Celebrate extends Component {
  onPressLikeIcon = () => {};

  render() {
    const {
      full_name,
      changed_attribute_value,
      title,
      likes_count,
    } = this.props.event;
    return (
      <Card style={styles.card}>
        <Flex value={1} direction={'row'}>
          <Flex value={1} direction={'column'}>
            <Text style={styles.name}>{full_name.toUpperCase()}</Text>
            <Text style={styles.time}>{changed_attribute_value}</Text>
            <Text style={styles.description}>{title}</Text>
          </Flex>
          <Flex direction={'column'} align="start">
            <Flex direction={'row'} align="center">
              <Text style={styles.likeCount}>
                {likes_count > 0 ? likes_count : null}
              </Text>
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
