import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Card, Button } from '../common';

import styles from './styles';

@translate('stepReminder')
export default class ReminderDateText extends Component {
  render() {
    const { t, reminder, style } = this.props;
    const { type, at } = reminder;

    return (
      <Text style={[styles.reminderText, style]}>
        {type && at ? `${at} ${type}` : t('setReminder')}
      </Text>
    );
  }
}

ReminderDateText.propTypes = {
  reminder: PropTypes.object.isRequired,
};
