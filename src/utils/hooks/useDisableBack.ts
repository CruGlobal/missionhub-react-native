import { BackHandler } from 'react-native';
import { useRef, useEffect } from 'react';

export const useDisableBack = (enableBackButton: boolean = false) => {
  const disableBackPress = useRef(() => true);
  const removeListener = () =>
    BackHandler.removeEventListener(
      'hardwareBackPress',
      disableBackPress.current,
    );

  useEffect(() => {
    if (!enableBackButton) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        disableBackPress.current,
      );
      return removeListener;
    }
  });

  return removeListener;
};
