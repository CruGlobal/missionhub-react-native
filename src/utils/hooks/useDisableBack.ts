import { BackHandler } from 'react-native';
import { useRef, useEffect } from 'react';

export const useDisableBack = () => {
  const disableBackPress = useRef(() => true);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', disableBackPress.current);
    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        disableBackPress.current,
      );
  }, []);
};
