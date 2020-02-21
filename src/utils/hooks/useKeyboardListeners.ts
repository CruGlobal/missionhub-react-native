import { useEffect } from 'react';
import { Keyboard } from 'react-native';

import { isAndroid } from '../common';

export const useKeyboardListeners = ({
  onShow,
  onHide,
}: {
  onShow?: () => void;
  onHide?: () => void;
}) => {
  useEffect(() => {
    const keyboardShowListener = onShow
      ? Keyboard.addListener(
          isAndroid ? 'keyboardDidShow' : 'keyboardWillShow',
          onShow,
        )
      : null;
    const keyboardHideListener = onHide
      ? Keyboard.addListener(
          isAndroid ? 'keyboardDidHide' : 'keyboardWillHide',
          onHide,
        )
      : null;

    return () => {
      keyboardShowListener && keyboardShowListener.remove();
      keyboardHideListener && keyboardHideListener.remove();
    };
  }, [onShow, onHide]);
};
