import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text } from '../../components/common';

import styles from './styles';

export default class ItemHeaderText extends Component {
  render() {
    const { text } = this.props;
    return <Text style={styles.name}>{text.toUpperCase()}</Text>;
  }
}

ItemHeaderText.propTypes = {
  text: PropTypes.string.isRequired,
};
