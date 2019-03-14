import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from '../common';

import styles from './styles';
// import theme from '../../theme';

export default class IconButton extends Component {
  handlePress = () => {
    const { pressProps, onPress } = this.props;
    if (onPress) {
      // Call the onPress with all of the pressProps passed in or just undefined if it doesn't exist
      onPress.apply(null, pressProps);
    }
  };
  render() {
    // Remove `pressProps` and `onPress` so that they aren't included in the `...rest` array
    const { name, type, style = {}, onPress, pressProps, ...rest } = this.props; // eslint-disable-line no-unused-vars

    return (
      <Button type="transparent" {...rest} onPress={this.handlePress}>
        <Icon
          name={name}
          type={type}
          style={[styles.iconWrap, style]}
          {...rest}
        />
      </Button>
    );
  }
}

IconButton.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  pressProps: PropTypes.array,
  onPress: PropTypes.func,
};
