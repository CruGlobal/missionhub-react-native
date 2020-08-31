import React from 'react';
import { StyleProp, ViewStyle, Text } from 'react-native';
import { IconProps } from 'react-native-vector-icons/Icon';

import { Flex, IconButton } from '../common';

import styles from './styles';

interface CenteredIconButtonWithTextProps {
  icon: string;
  text: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  iconStyle?: IconProps['style'];
  onClick?: () => void;
}

const CenteredIconButtonWithText = ({
  icon,
  text,
  wrapperStyle: propsWrapperStyle,
  iconStyle: iconStyle,
  onClick,
}: CenteredIconButtonWithTextProps) => {
  const newButtonStyle = [
    styles.button,
    onClick ? {} : styles.buttonDisabled,
    iconStyle,
  ];
  const newWrapperStyle = [styles.iconWrap, propsWrapperStyle];
  return (
    <Flex align="center" justify="center">
      <Flex align="center" justify="center" style={newWrapperStyle}>
        <IconButton
          disabled={!onClick}
          style={newButtonStyle}
          name={icon}
          type="MissionHub"
          onPress={onClick || (() => {})}
        />
      </Flex>
      <Text style={styles.text}>{text}</Text>
    </Flex>
  );
};

export default CenteredIconButtonWithText;
