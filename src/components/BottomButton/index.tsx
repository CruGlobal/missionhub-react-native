import React from 'react';
import { View } from 'react-native';

import { Button } from '../../components/common';
import theme from '../../theme';

export interface BottomButtonProps {
  text: string;
  onPress: Function;
  disabled?: boolean;
  testID?: string;
}

const BottomButton = ({ text, disabled, onPress }: BottomButtonProps) => {
  const handlePress = () => {
    onPress();
  };
  return (
    <View
      style={{
        width: theme.fullWidth,
        flex: 0,
        alignItems: 'center',
      }}
    >
      <Button
        testID="bottomButton"
        type="secondary"
        disabled={disabled}
        onPress={handlePress}
        text={text.toUpperCase()}
        style={{
          width: 300,
          height: 48,
          marginBottom: 20,
        }}
        pill={true}
      />
    </View>
  );
};

export default BottomButton;
