import { useEffect } from 'react';
import { useIsFocused } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';

import { trackScreenChange } from '../../actions/analytics';

import { useIsDrawerOpen } from './useIsDrawerOpen';

export enum ANALYTICS_SCREEN_TYPES {
  screen,
  screenWithDrawer,
  drawer,
}

export interface UseAnalyticsOptions {
  triggerTracking?: boolean;
  screenType?: ANALYTICS_SCREEN_TYPES;
}

export const useAnalytics = (
  screenName: string | string[],
  {
    triggerTracking = true,
    screenType = ANALYTICS_SCREEN_TYPES.screen,
  }: UseAnalyticsOptions = {},
) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();

  const handleScreenChange = (name: string | string[]) => {
    dispatch(trackScreenChange(name));
  };

  //normally screens should only respond to focus events
  useEffect(() => {
    if (
      isFocused &&
      screenType === ANALYTICS_SCREEN_TYPES.screen &&
      triggerTracking
    ) {
      handleScreenChange(screenName);
    }
  }, [isFocused, triggerTracking]);

  //if it is a drawer, or screen with a drawer, it should respond to drawer events in addition to focus events
  useEffect(() => {
    if (isFocused && triggerTracking) {
      if (screenType === ANALYTICS_SCREEN_TYPES.drawer && isDrawerOpen) {
        handleScreenChange(screenName);
      } else if (
        screenType === ANALYTICS_SCREEN_TYPES.screenWithDrawer &&
        !isDrawerOpen
      ) {
        handleScreenChange(screenName);
      }
    }
  }, [isFocused, isDrawerOpen, triggerTracking]);

  return handleScreenChange;
};
