import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';

import { Button, Icon } from '../common';

import styles from './styles';

interface IconButtonProps {
  name: string;
  type?: 'Material' | 'FontAwesome' | 'Ionicons' | 'MissionHub';
  style?: StyleProp<ViewStyle>;
  pressProps?: [];
  onPress?: Function;
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
    <Button type="transparent" {...rest} onPress={handlePress}>
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
