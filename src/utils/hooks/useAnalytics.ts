import { useEffect } from 'react';
import { useIsFocused } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';

import { trackScreenChange, ScreenContext } from '../../actions/analytics';
import { DrawerState } from '../../reducers/drawer';

export enum ANALYTICS_SCREEN_TYPES {
  screen,
  screenWithDrawer,
  drawer,
}

interface UseAnalyticsParams {
  screenName: string | string[];
  screenType?: ANALYTICS_SCREEN_TYPES;
  screenContext?: Partial<ScreenContext>;
}

export const useAnalytics = ({
  screenName,
  screenType = ANALYTICS_SCREEN_TYPES.screen,
  screenContext = {},
}: UseAnalyticsParams) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isDrawerOpen = useSelector(
    ({ drawer }: { drawer: DrawerState }) => drawer.isOpen,
  );

  const handleScreenChange = (name: string | string[]) => {
    dispatch(trackScreenChange(name, screenContext));
  };

  //normally screens should only respond to focus events
  useEffect(() => {
    if (isFocused && screenType === ANALYTICS_SCREEN_TYPES.screen) {
      handleScreenChange(screenName);
    }
  }, [isFocused]);

  //if it is a drawer, or screen with a drawer, it should respond to drawer events in addition to focus events
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
