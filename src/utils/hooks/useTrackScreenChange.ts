import * as RNOmniture from 'react-native-omniture';
import { useEffect } from 'react';
// eslint-disable-next-line import/named
import { NavigationEventSubscription } from 'react-navigation';
import { useNavigation } from 'react-navigation-hooks';

export const useTrackScreenChange = (
  screenNameFragments: string[],
  extraContext: any = {},
) => {
  const navigation = useNavigation();

  let willFocus: NavigationEventSubscription;

  const screenName = screenNameFragments.reduce(
    (name: string, current: string) => `${name} : ${current}`,
    'mh',
  );

  useEffect(() => {
    const MCID = 'MCID';

    const trackScreenChange = async () => {
      if (!MCID) {
        //get Marketing Cloud Id
      }

      console.log(screenName);
      //RNOmniture.trackState(screenName, extraContext);
      //sendStateToSnowplow(context);
    };

    const addListeners = () => {
      willFocus = navigation.addListener('willFocus', () =>
        trackScreenChange(),
      );
    };
    const removeListeners = () => {
      willFocus && willFocus.remove();
    };

    addListeners();
    return removeListeners;
  });
};
