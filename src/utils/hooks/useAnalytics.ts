import { useCallback } from 'react';
import { useFocusEffect } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';

import { trackScreenChange } from '../../actions/analytics';
import { DrawerState } from '../../reducers/drawer';

export const useAnalytics = (
  screenName: string | string[],
  isDrawer = false,
) => {
  const dispatch = useDispatch();
  const isDrawerOpen = useSelector(
    ({ drawer }: { drawer: DrawerState }) => drawer.isOpen,
  );

  const handleScreenChange = (name: string | string[]) => {
    dispatch(trackScreenChange(name));
  };

  useFocusEffect(
    useCallback(() => {
      if (isDrawer && isDrawerOpen) {
        handleScreenChange(screenName);
      } else if (!isDrawer && !isDrawerOpen) {
        handleScreenChange(screenName);
      }
    }, [isDrawerOpen]),
  );

  return handleScreenChange;
};
