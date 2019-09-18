import { BackHandler } from 'react-native';
import { useEffect } from 'react';
import { NavigationEventSubscription } from 'react-navigation';
import { useNavigation } from 'react-navigation-hooks';

import { navigateBack } from '../../actions/navigation';

export const useDisableBack = (
  enableBackButton = false,
  onBackPress?: () => void,
) => {
  const navigation = useNavigation();

  let willFocus: NavigationEventSubscription;
  let willBlur: NavigationEventSubscription;

  const handleBackPress = () => {
    if (enableBackButton) {
      if (onBackPress) {
        console.log('custom back');
        return onBackPress();
      }
      console.log('nav back');
      return navigation.dispatch(navigateBack());
    }
    console.log('no back');
    return true;
  };

  const addListeners = () => {
    console.log('add listeners');
    willFocus = navigation.addListener('willFocus', () =>
      BackHandler.addEventListener('hardwareBackPress', handleBackPress),
    );
    willBlur = navigation.addListener('willBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress),
    );
  };
  const removeListeners = () => {
    console.log('remove listeners');
    willFocus && willFocus.remove();
    willBlur && willBlur.remove();
    BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  };

  useEffect(() => {
    addListeners();
    return removeListeners;
  });
};
