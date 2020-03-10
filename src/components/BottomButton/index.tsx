import React from 'react';
import { SafeAreaView, StyleProp, TextStyle } from 'react-native';

import { Button } from '../../components/common';
import theme from '../../theme';
import { TouchablePress } from '../Touchable/index.ios';

export interface BottomButtonProps {
  text: string;
  onPress: TouchablePress;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const BottomButton = ({
  text,
  disabled,
  onPress,
  style,
}: BottomButtonProps) => {
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
        style={[
          {
            width: theme.fullWidth - 100,
            height: 48,
            alignItems: 'center',
          },
          style,
        ]}
        buttonTextStyle={[style]}
        pill={true}
      />
    </SafeAreaView>
  );
};

export default BottomButton;
