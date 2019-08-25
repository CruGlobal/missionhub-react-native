import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { Flex, Text, IconButton } from '../common';

import styles from './styles';

interface CenteredIconButtonWithTextProps {
  icon: string;
  text: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  onClick?: Function;
}

const CenteredIconButtonWithText = ({
  icon,
  text,
  wrapperStyle: propsWrapperStyle,
  buttonStyle: propsButtonStyle,
  onClick,
}: CenteredIconButtonWithTextProps) => {
  const newButtonStyle = [
    styles.button,
    onClick ? {} : styles.buttonDisabled,
    propsButtonStyle,
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
