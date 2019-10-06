import React from 'react';

import { Button } from '../../components/common';
import theme from '../../theme';
import { TouchablePress } from '../Touchable/index.ios';

export interface BottomButtonProps {
  text: string;
  onPress: TouchablePress;
  disabled?: boolean;
  testID?: string;
}

const BottomButton = ({ text, disabled, onPress }: BottomButtonProps) => {
  const handlePress = () => {
    onPress();
  };
  return (
    <Button
      testID="bottomButton"
      type="secondary"
      disabled={disabled}
      onPress={handlePress}
      text={text.toUpperCase()}
      style={{
        flex: 0,
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        width: theme.fullWidth,
      }}
    />
  );
};

export default BottomButton;
