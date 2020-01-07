import { useEffect } from 'react';
import { useIsFocused, useFocusEffect } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';

import { trackScreenChange } from '../../actions/analytics';
import { DrawerState } from '../../reducers/drawer';

export enum ANALYTICS_SCREEN_TYPES {
  screen,
  screenWithDrawer,
  drawer,
}

export const useAnalytics = (
  screenName: string | string[],
  screenType = ANALYTICS_SCREEN_TYPES.screen,
) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isDrawerOpen = useSelector(
    ({ drawer }: { drawer: DrawerState }) => drawer.isOpen,
  );

  const handleScreenChange = (name: string | string[]) => {
    dispatch(trackScreenChange(name));
  };

  useEffect(() => {
    if (isFocused) {
      if (screenType === ANALYTICS_SCREEN_TYPES.screen) {
        handleScreenChange(screenName);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      if (screenType === ANALYTICS_SCREEN_TYPES.drawer && isDrawerOpen) {
        handleScreenChange(screenName);
      } else if (
        screenType === ANALYTICS_SCREEN_TYPES.screenWithDrawer &&
        !isDrawerOpen
      ) {
        handleScreenChange(screenName);
      }
    }
  }, [isFocused, isDrawerOpen]);

  return handleScreenChange;
};
