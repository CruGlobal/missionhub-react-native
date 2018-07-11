import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { Flex, Text, IconButton } from '../common';

import styles from './styles';

export default class GroupsPersonHeader extends Component {
  stageButton = this.button('journeyIcon', 'Stage');
  emailButton = this.button('emailIcon', 'Email', styles.emailButton);

  contactButtons = [
    this.stageButton,
    this.button('journeyWarning', 'Status'),
    this.emailButton,
  ];

  memberButtons = [
    this.stageButton,
    this.button('textIcon', 'Message'),
    this.button('callIcon', 'Call'),
    this.emailButton,
  ];

  button(icon, text, style) {
    return (
      <Flex align="center" justify="center" key={uuidv4()}>
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
        {this.props.isMember ? this.memberButtons : this.contactButtons}
      </Flex>
    );
  }
}

GroupsPersonHeader.propTypes = {
  isMember: PropTypes.bool.isRequired,
};
