import { useEffect } from 'react';
// eslint-disable-next-line import/named
import { NavigationEventSubscription } from 'react-navigation';
import { useNavigation } from 'react-navigation-hooks';

import { store } from '../../store';
import { trackScreenChange } from '../../actions/analytics';

export const useTrackScreenChange = (
  screenNameFragments: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraContext: { [key: string]: any } = {},
) => {
  const navigation = useNavigation();

  let willFocus: NavigationEventSubscription;

  useEffect(() => {
    const addListeners = () => {
      willFocus = navigation.addListener('willFocus', () =>
        store.dispatch(trackScreenChange(screenNameFragments, extraContext)),
      );
    };
    const removeListeners = () => {
      willFocus && willFocus.remove();
    };

    addListeners();
    return removeListeners;
  });
};
