import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import debounce from 'lodash/debounce';


import { Touchable, Text } from '../common';
import { exists } from '../../utils/common';

import styles from './styles';

const TYPES = [ 'transparent', 'primary', 'secondary' ];
// Return the styles.TYPE if it exists or just the default button style
const getTypeStyle = (type) => exists(styles[type]) ? styles[type] : styles.button;

export default class Button extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clickedDisabled: false,
    };

    // Debounce this function so it doesn't get called too quickly in succession
    this.handlePress = debounce(this.handlePress.bind(this), 25);
  }

  componentWillUnmount() {
    // Make sure to clear the timeout when the Button unmounts
    clearTimeout(this.clickDisableTimeout);
  }
  
  handlePress(...args) {
    // Prevent the user from being able to click twice
    this.setState({ clickedDisabled: true });
    // Re-enable the button after the timeout
    this.clickDisableTimeout = setTimeout(() => { this.setState({ clickedDisabled: false }); }, 400);
    // Call the users click function with all the normal click parameters
    this.props.onPress(...args);
  }

  render() {
    const { type, text, pill, children, disabled, style = {}, buttonTextStyle = {}, ...rest } = this.props;
    let content = children;
    if (!children) {
      // If there are no children passed in, assume text is used for the button
      const textStyle = [ styles.buttonText, buttonTextStyle ];
      if (text) {
        content = <Text style={textStyle}>{text}</Text>;
      }
    }
    const isDisabled = disabled || this.state.clickedDisabled;
    return (
      <Touchable {...rest} disabled={isDisabled} onPress={this.handlePress}>
        <View
          style={[
            getTypeStyle(type),
            disabled ? styles.disabled : null,
            style,
            pill ? styles.pill : null,
          ]}>
          {content}
        </View>
      </Touchable>
    );
  }
}

const styleTypes = [ PropTypes.array, PropTypes.object, PropTypes.number ];
Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  type: PropTypes.oneOf(TYPES),
  text: PropTypes.string,
  pill: PropTypes.bool,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
};
