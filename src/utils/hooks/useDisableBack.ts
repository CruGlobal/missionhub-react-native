import { BackHandler } from 'react-native';
import { useRef, useEffect } from 'react';

export const useDisableBack = (enableBackButton = false) => {
  if (enableBackButton) {
    return () => {};
  }

  const disableBackPress = useRef(() => true);
  const removeListener = () =>
    BackHandler.removeEventListener(
      'hardwareBackPress',
      disableBackPress.current,
    );

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', disableBackPress.current);
    return removeListener;
  });

  return removeListener;
};
