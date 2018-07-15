import React, { Component } from 'react';

import {
  Card,
  Text,
  Flex,
  IconButton,
  DateComponent,
} from '../../components/common';

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
            <Text style={styles.name}>{'me'.toUpperCase()}</Text>
            <DateComponent
              style={styles.time}
              date={changed_attribute_value}
              format={'LT'}
            />
            <Text style={styles.description}>{title}</Text>
          </Flex>
          <Flex direction={'column'} align="start">
            <Flex direction={'row'} align="center">
              <Text style={styles.likeCount}>
                {likes_count > 0 ? likes_count : null}
              </Text>
              <IconButton
                name="likeActiveIcon"
                type="MissionHub"
                onPress={this.onPressLikeIcon}
                style={[styles.icon, styles.likeActive]}
              />
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  }
}
