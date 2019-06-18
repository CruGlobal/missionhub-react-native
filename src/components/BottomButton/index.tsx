import React from 'react';

import { Button } from '../../components/common';
import theme from '../../theme';

interface BottomButtonProps {
  text: string;
  onPress: Function;
  disabled?: boolean;
}

const BottomButton = ({ text, disabled, onPress }: BottomButtonProps) => {
  const handlePress = () => {
    onPress && onPress();
  };
  return (
    <Button
      flex={0}
      alignItems="stretch"
      justifyContent="flex-end"
      type="secondary"
      disabled={disabled}
      onPress={handlePress}
      text={text.toUpperCase()}
      style={{ width: theme.fullWidth }}
    />
  );
};

export default BottomButton;
