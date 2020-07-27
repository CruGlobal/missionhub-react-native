import React from 'react';
import {
  SafeAreaView,
  StyleProp,
  TextStyle,
  ImageSourcePropType,
  GestureResponderEvent,
} from 'react-native';

import { Button } from '../../components/common';
import theme from '../../theme';

export interface BottomButtonProps {
  text: string;
  image?: ImageSourcePropType;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const BottomButton = ({
  text,
  disabled,
  onPress,
  style,
  image,
}: BottomButtonProps) => {
  const handlePress = (event: GestureResponderEvent) => {
    onPress(event);
  };

  return (
    <SafeAreaView style={{ position: 'absolute', bottom: 20, left: 50 }}>
      <Button
        testID="bottomButton"
        image={image}
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
