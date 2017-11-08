import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../common';
import styles from './styles';

export default class PillButton extends Component {
  render() {
    const { filled, ...rest } = this.props;
    return (
      <Button
        {...rest}
        style={[styles.button, filled ? null : styles.empty]}
        buttonTextStyle={[styles.buttonText, filled ? null : styles.emptyText]}
      />
    );
  }
}

PillButton.propTypes = {
  filled: PropTypes.bool,
};
