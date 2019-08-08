import { useEffect } from 'react';
import { Keyboard } from 'react-native';

import { isAndroid } from '../common';

export const useKeyboardListeners = (
  onShow: () => void,
  onHide: () => void,
) => {
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      isAndroid ? 'keyboardDidShow' : 'keyboardWillShow',
      onShow,
    );
    const keyboardHideListener = Keyboard.addListener(
      isAndroid ? 'keyboardDidHide' : 'keyboardWillHide',
      onHide,
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [onShow, onHide]);
};
