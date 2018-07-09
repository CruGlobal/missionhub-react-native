import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';

import { Flex, Text, IconButton } from '../common';

import styles from './styles';

export default class GroupsContactHeader extends Component {
  button(icon, text, style) {
    return (
      <Flex align="center" justify="center">
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton
            style={[styles.contactButton, style]}
            name={icon}
            type="MissionHub"
            onPress={() => {}}
          />
        </Flex>
        <Text style={styles.text}>{text}</Text>
      </Flex>
    );
  }

  render() {
    return (
      <Flex align="center" justify="center" direction="row">
        {this.button('journeyIcon', 'Stage')}
        {this.button('journeyWarning', 'Status')}
        {this.button('emailIcon', 'Email', styles.emailButton)}
      </Flex>
    );
  }
}
