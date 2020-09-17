import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';

import { setAuthToken } from '../../../auth/authStore';
import theme from '../../../theme';

const VERSION_NUMBER_PRESS_THRESHOLD = 10;

export const useDevMenu = () => {
  const [isDevMenuVisible, setIsDevMenuVisible] = useState(false);
  const [versionNumberPressCount, setVersionNumberPressCount] = useState(0);

  const onVersionNumberPress = () => {
    const newPressCount = versionNumberPressCount + 1;
    setVersionNumberPressCount(newPressCount);
    if (newPressCount >= VERSION_NUMBER_PRESS_THRESHOLD) {
      setIsDevMenuVisible(true);
    }
  };

  return { isDevMenuVisible, onVersionNumberPress };
};

interface DevMenuItemProps {
  text: string;
  action?: () => void;
  isHeading?: boolean;
}

const DevMenuItem = ({ text, action, isHeading = false }: DevMenuItemProps) => {
  return (
    <Pressable onPress={action}>
      {({ pressed }) => (
        <Text
          style={{
            paddingVertical: 9,
            ...theme.textRegular16,
            letterSpacing: 0.2,
            color: pressed ? theme.lightGrey : theme.darkGrey,
            ...(isHeading ? theme.textLight24 : {}),
          }}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
};

interface DevMenuProps {
  isDevMenuVisible: boolean;
}

export const DevMenu = ({ isDevMenuVisible }: DevMenuProps) => {
  return isDevMenuVisible ? (
    <View style={{ paddingHorizontal: 24 }}>
      <DevMenuItem text="Developer Tools" isHeading={true} />
      <DevMenuItem
        text="Invalidate auth token"
        action={() => setAuthToken('invalid')}
      />
    </View>
  ) : null;
};
