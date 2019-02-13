import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DateComponent } from '../../components/common';

import styles from './styles';

export default class CardTime extends Component {
  render() {
    const { date } = this.props;
    return <DateComponent style={styles.time} date={date} format={'LT'} />;
  }
}

CardTime.propTypes = {
  date: PropTypes.string.isRequired,
};
