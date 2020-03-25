import React from 'react';
import { SafeAreaView, ImageSourcePropType } from 'react-native';

import { Button } from '../../components/common';
import theme from '../../theme';
import { TouchablePress } from '../Touchable/index.ios';

export interface BottomButtonProps {
  text: string;
  image?: ImageSourcePropType;
  onPress: TouchablePress;
  disabled?: boolean;
  testID?: string;
}

const BottomButton = ({
  text,
  disabled,
  onPress,
  image,
}: BottomButtonProps) => {
  const handlePress = () => {
    onPress();
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
        style={
          !disabled
            ? {
                width: theme.fullWidth - 100,
                height: 48,
                alignItems: 'center',
              }
            : {
                width: theme.fullWidth - 100,
                height: 48,
                alignItems: 'center',
                backgroundColor: theme.lightGrey,
              }
        }
        pill={true}
      />
    </SafeAreaView>
  );
};

export default BottomButton;
