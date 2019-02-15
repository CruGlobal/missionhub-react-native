import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../../components/common';
import theme from '../../theme';

export default class BottomButton extends Component {
  handlePress = () => {
    const { onPress } = this.props;
    onPress && onPress();
  };

  render() {
    const { text, disabled } = this.props;

    return (
      <Button
        flex={0}
        align="stretch"
        justify="end"
        type="secondary"
        disabled={disabled}
        onPress={this.handlePress}
        text={text.toUpperCase()}
        style={{ width: theme.fullWidth }}
      />
    );
  }
}

BottomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
