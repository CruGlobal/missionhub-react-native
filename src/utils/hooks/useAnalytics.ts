import { useEffect } from 'react';
import { useIsFocused } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { trackScreenChange } from '../../actions/analytics';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../../containers/Groups/CreatePostButton/queries';
import { getMyCommunityPermission } from '../../containers/Groups/CreatePostButton/__generated__/getMyCommunityPermission';

import { useIsMe, useMyId } from './useIsMe';
import { useIsOnboarding } from './useIsOnboarding';
import { useIsDrawerOpen } from './useIsDrawerOpen';

export enum ANALYTICS_SCREEN_TYPES {
  screen,
  screenWithDrawer,
  drawer,
}

export interface UseAnalyticsOptions {
  triggerTracking?: boolean;
  screenType?: ANALYTICS_SCREEN_TYPES;
  assignmentType?: { personId?: string; communityId?: string };
  sectionType?: boolean;
  editMode?: { isEdit: boolean };
  permissionType?: { communityId?: string };
}

export const useAnalytics = (
  screenName: string | string[],
  {
    triggerTracking = true,
    screenType = ANALYTICS_SCREEN_TYPES.screen,
    assignmentType,
    sectionType,
    editMode,
    permissionType,
  }: UseAnalyticsOptions = {},
) => {
  const myId = useMyId();
  const isMe = useIsMe(assignmentType?.personId || '');
  const isOnboarding = useIsOnboarding();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();

  const {
    data: { community: { people: { edges = [] } = {} } = {} } = {},
    loading,
    error,
  } = useQuery<getMyCommunityPermission>(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: permissionType?.communityId,
      myId,
    },
    fetchPolicy: 'cache-first',
    skip: !(permissionType?.communityId && triggerTracking),
  });

  const handleScreenChange = (name: string | string[]) => {
    dispatch(trackScreenChange(name));
  };

  //normally screens should only respond to focus events
  useEffect(() => {
    if (
      isFocused &&
      !loading &&
      !error &&
      screenType === ANALYTICS_SCREEN_TYPES.screen &&
      triggerTracking
    ) {
      handleScreenChange(screenName);
    }
  }, [isFocused, loading, error, triggerTracking]);

  //if it is a drawer, or screen with a drawer, it should respond to drawer events in addition to focus events
  useEffect(() => {
    if (isFocused && !loading && !error && triggerTracking) {
      if (screenType === ANALYTICS_SCREEN_TYPES.drawer && isDrawerOpen) {
        handleScreenChange(screenName);
      } else if (
        screenType === ANALYTICS_SCREEN_TYPES.screenWithDrawer &&
        !isDrawerOpen
      ) {
        handleScreenChange(screenName);
      }
    }
  }, [isFocused, loading, error, isDrawerOpen, triggerTracking]);

  return handleScreenChange;
};
