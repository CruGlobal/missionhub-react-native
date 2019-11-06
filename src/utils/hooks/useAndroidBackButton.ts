import { BackHandler } from 'react-native';
import { useEffect } from 'react';
// eslint-disable-next-line import/named
import { NavigationEventSubscription } from 'react-navigation';
import { useNavigation } from 'react-navigation-hooks';

export const useAndroidBackButton = (
  enableBackButton = false,
  onBackPress?: () => void,
) => {
  const navigation = useNavigation();

  let willFocus: NavigationEventSubscription;
  let willBlur: NavigationEventSubscription;

  useEffect(() => {
    const handleBackPress = () => {
      if (enableBackButton) {
        if (onBackPress) {
          onBackPress();
        } else {
          return false;
        }
      }
      return true;
    };

    const addListeners = () => {
      willFocus = navigation.addListener('willFocus', () => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      });
      willBlur = navigation.addListener('willBlur', () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      });
    };
    const removeListeners = () => {
      willFocus && willFocus.remove();
      willBlur && willBlur.remove();
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };

    addListeners();
    return removeListeners;
  }, [enableBackButton, onBackPress]);
};
