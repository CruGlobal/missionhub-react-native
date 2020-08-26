import React from 'react';
import { View, ColorValue } from 'react-native';

import Button from '../../../../components/Button';
import { Text } from '../../../../components/common';

import { styles } from './styles';

interface SocialAuthButtonProps {
  text: string;
  icon: React.ReactNode;
  onPress: () => void;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  borderColor?: ColorValue;
}

export const SocialAuthButton = ({
  text,
  icon,
  onPress,
  backgroundColor,
  textColor = 'white',
  borderColor,
}: SocialAuthButtonProps) => {
  return (
    <Button
      testID="socialAuthButton"
      onPress={() => {
        try {
          return onPress();
        } catch {}
      }}
      style={[
        styles.socialButton,
        {
          backgroundColor,
          borderColor,
          borderWidth: borderColor ? 1 : undefined,
        },
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.socialButtonText, { color: textColor }]}>
        {text}
      </Text>
    </Button>
  );
};
