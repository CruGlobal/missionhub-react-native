import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Touchable, Icon, Text, Button } from '../common';
import { navigatePush } from '../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';
import DatePicker from '../DatePicker';
import { isAndroid } from '../../utils/common';

import styles from './styles';

@translate('stepReminder')
class ReminderButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  handleSetReminder = () => {
    if (isAndroid) {
      const { dispatch, step } = this.props;
      dispatch(navigatePush(STEP_REMINDER_SCREEN, { step }));
    } else {
      this.setState({ visible: true });
    }
  };

  handleRemoveReminder = () => {};

  render() {
    const { t } = this.props;
    const {
      reminderButton,
      reminderContainer,
      reminderIconCircle,
      reminderIcon,
      reminderText,
      cancelIconButton,
      cancelIcon,
    } = styles;

    return (
      <Touchable style={reminderButton} onPress={this.handleSetReminder}>
        <View style={reminderContainer}>
          <View style={reminderIconCircle}>
            <Icon name="bellIcon" type="MissionHub" style={reminderIcon} />
          </View>
          <Text style={reminderText}>{t('setReminder')}</Text>
        </View>
        <Button onPress={this.handleRemoveReminder} style={cancelIconButton}>
          <Icon name="close" type="Material" style={cancelIcon} />
        </Button>
        <DatePicker visible={this.state.visible} />
      </Touchable>
    );
  }
}

export default connect()(ReminderButton);
