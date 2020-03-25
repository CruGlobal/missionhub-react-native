import React from 'react';
import {
  StyleProp,
  TextStyle,
  Insets,
  Image,
  ImageSourcePropType,
} from 'react-native';

import { Button } from '../common';
import Icon, { IconProps } from '../Icon';

import styles from './styles';

interface IconButtonProps extends IconProps {
  name: string;
  type?: 'Material' | 'FontAwesome' | 'Ionicons' | 'MissionHub';
  buttonStyle?: StyleProp<TextStyle>;
  style?: StyleProp<TextStyle>;
  image?: ImageSourcePropType;
  pressProps?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  onPress?: Function;
  testID?: string;
  hitSlop?: Insets;
  disabled?: boolean;
}

const IconButton = ({
  name,
  type,
  buttonStyle,
  style = {},
  onPress,
  pressProps = [],
  image,
  ...rest
}: IconButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      // Call the onPress with all of the pressProps passed in or just undefined if it doesn't exist
      onPress(...pressProps);
    }
  };
  return (
    <Button
      type="transparent"
      {...(buttonStyle ? { style: buttonStyle } : {})}
      {...rest}
      onPress={handlePress}
      testID="IconButton"
    >
      {image ? (
        <Image source={image} style={styles.iconWrap} />
      ) : (
        <Icon
          name={name}
          type={type}
          style={[styles.iconWrap, style]}
          {...rest}
        />
      )}
    </Button>
  );
};

export default IconButton;
