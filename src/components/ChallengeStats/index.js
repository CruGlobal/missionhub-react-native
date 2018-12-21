import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Text, Flex } from '../../components/common';

import styles from './styles';

@translate('challengeStats')
class ChallengeStats extends Component {
  render() {
    const { t, challenge, style: containerStyle, small } = this.props;
    const {
      end_date,
      accepted_count,
      completed_count,
      isPast,
      created_at,
    } = challenge;

    // Total days or days remaining
    const endDate = moment(end_date).endOf('day');
    const startDate = moment(created_at).endOf('day');
    const today = moment().endOf('day');
    // If it's past, make sure it shows "1 day challenge instead of 0 day challenge"
    const days = isPast
      ? endDate.diff(startDate, 'days') + 1
      : endDate.diff(today, 'days');

    const numberStyle = small ? styles.numberSmall : styles.number;

    return (
      <Flex style={containerStyle} direction="row" justify="between">
        <Flex direction="column" justify="start">
          <Text style={styles.subHeader}>
            {isPast ? t('days') : t('daysLeft')}
          </Text>
          <Text style={numberStyle}>{days}</Text>
        </Flex>
        <Flex direction="column" justify="start">
          <Text style={styles.subHeader}>{t('joined')}</Text>
          <Text style={numberStyle}>{accepted_count}</Text>
        </Flex>
        <Flex direction="column" justify="start">
          <Text style={styles.subHeader}>{t('completed')}</Text>
          <Text style={numberStyle}>{completed_count}</Text>
        </Flex>
      </Flex>
    );
  }
}

ChallengeStats.propTypes = {
  challenge: PropTypes.object.isRequired,
  small: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default ChallengeStats;
