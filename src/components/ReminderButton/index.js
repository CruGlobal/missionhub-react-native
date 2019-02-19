import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Touchable, Icon, Text } from '../common';
import { navigatePush } from '../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';

import styles from './styles';

@translate()
class ReminderButton extends Component {
  handlePress = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(STEP_REMINDER_SCREEN, { step }));
  };

  render() {
    const { t } = this.props;
    const { reminderButton, reminderIcon, reminderText } = styles;

    return (
      <Touchable onPress={this.handlePress}>
        <Flex
          align="center"
          justify="start"
          style={reminderButton}
          direction="row"
        >
          <Icon name="bellIcon" type="MissionHub" style={reminderIcon} />
          <Text style={reminderText}>{t('addStep:setReminder')}</Text>
        </Flex>
      </Touchable>
    );
  }
}

export default connect()(ReminderButton);
