import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Touchable, Icon, Text } from '../common';
import ReminderText from '../ReminderText';

import styles from './styles';

@translate()
class ReminderButton extends Component {
  render() {
    const { t, step } = this.props;
    const { reminderButton, reminderIcon, reminderText } = styles;

    return (
      <Touchable>
        <Flex
          align="center"
          justify="start"
          style={reminderButton}
          direction="row"
        >
          <Icon name="bellIcon" type="MissionHub" style={reminderIcon} />
          <ReminderText reminder={step.reminder} style={reminderText} />
        </Flex>
      </Touchable>
    );
  }
}

export default connect()(ReminderButton);
