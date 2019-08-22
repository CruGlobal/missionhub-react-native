import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { Touchable, Text } from '../common';

import styles from './styles';

interface RadioButtonProps {
  onSelect: Function;
  checked: boolean;
  label: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pressProps?: any[];
}
const RadioButton = ({
  checked,
  onSelect,
  size = 25,
  style,
  labelTextStyle,
  label,
  pressProps,
}: RadioButtonProps) => {
  return (
    <Touchable pressProps={pressProps} onPress={onSelect}>
      <View style={[styles.wrap, style]}>
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
            <Animatable.View
              duration={700}
              animation="bounceIn"
              style={styles.inside}
            />
          ) : null}
        </View>
        <Text style={[styles.label, labelTextStyle]}>{label}</Text>
      </View>
    </Touchable>
  );
};

export default RadioButton;
