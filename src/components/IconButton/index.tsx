import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';

import { Button } from '../common';
import Icon, { IconProps } from '../Icon';

import styles from './styles';

interface IconButtonProps extends IconProps {
  name: string;
  type?: 'Material' | 'FontAwesome' | 'Ionicons' | 'MissionHub';
  style?: StyleProp<ViewStyle>;
  pressProps?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  onPress?: Function;
  testID?: string;
}
const IconButton = ({
  name,
  type,
  style = {},
  onPress,
  pressProps,
  ...rest
}: IconButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      // Call the onPress with all of the pressProps passed in or just undefined if it doesn't exist
      onPress.apply(null, pressProps);
    }
  };
  return (
    <Button
      type="transparent"
      {...rest}
      onPress={handlePress}
      testID="IconButton"
    >
      <Icon
        name={name}
        type={type}
        style={[styles.iconWrap, style]}
        {...rest}
      />
    </Button>
  );
};

export default IconButton;
