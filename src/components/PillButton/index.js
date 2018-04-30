import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../common';

import styles from './styles';

export default class PillButton extends Component {
  render() {
    const { filled, style, buttonTextStyle, ...rest } = this.props;
    return (
      <Button
        {...rest}
        style={[ styles.button, filled ? null : styles.empty, style ]}
        buttonTextStyle={[ styles.buttonText, filled ? null : styles.emptyText, buttonTextStyle ]}
      />
    );
  }
}

const styleTypes = [ PropTypes.array, PropTypes.object, PropTypes.number ];
PillButton.propTypes = {
  filled: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
};
