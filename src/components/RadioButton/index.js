import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Touchable, Flex, Text } from '../common';

import styles from './styles';

export default class RadioButton extends Component {
  render() {
    const {
      checked,
      onSelect,
      size,
      style,
      labelTextStyle,
      label,
      pressProps, // Apply this to the onPress event within the `Touchable` component
    } = this.props;
    return (
      <Touchable pressProps={pressProps} onPress={onSelect}>
        <Flex direction="row" align="center" style={style}>
          <View
            style={[
              styles.outside,
              checked ? styles.checked : null,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
          >
            {checked ? (
              <Flex
                value={1}
                duration={700}
                animation="bounceIn"
                style={styles.inside}
              />
            ) : null}
          </View>
          <Text style={[styles.label, labelTextStyle]}>{label}</Text>
        </Flex>
      </Touchable>
    );
  }
}

RadioButton.propTypes = {
  onSelect: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  labelTextStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  pressProps: PropTypes.array,
};

RadioButton.defaultProps = {
  size: 25,
};
