import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../../components/common';

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
        alignItems="stretch"
        justifyContent="flex-end"
        type="secondary"
        disabled={disabled}
        onPress={this.handlePress}
        text={text.toUpperCase()}
      />
    );
  }
}

BottomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
