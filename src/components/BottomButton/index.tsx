import React from 'react';
import { SafeAreaView } from 'react-native';

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
    <SafeAreaView style={{ position: 'absolute', bottom: 20, left: 50 }}>
      <Button
        testID="bottomButton"
        type="secondary"
        disabled={disabled}
        onPress={handlePress}
        text={text.toUpperCase()}
        style={{
          width: theme.fullWidth - 100,
          height: 48,
          alignItems: 'center',
        }}
        pill={true}
      />
    </SafeAreaView>
  );
};

export default BottomButton;
