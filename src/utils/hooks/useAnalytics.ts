import { useEffect } from 'react';
import { useIsFocused } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { trackScreenChange, ScreenContext } from '../../actions/analytics';
import { DrawerState } from '../../reducers/drawer';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../../containers/Groups/CreatePostButton/queries';
import { getMyCommunityPermission } from '../../containers/Groups/CreatePostButton/__generated__/getMyCommunityPermission';
import {
  getAnalyticsPermissionType,
  getAnalyticsAssignmentType,
  getAnalyticsSectionType,
  getAnalyticsEditMode,
} from '../analytics';
import {
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_EDIT_MODE,
  ANALYTICS_PERMISSION_TYPE,
} from '../../constants';

import { useIsMe, useMyId } from './useIsMe';
import { useIsOnboarding } from './useIsOnboarding';

export enum ANALYTICS_SCREEN_TYPES {
  screen,
  screenWithDrawer,
  drawer,
}

export interface UseAnalyticsParams {
  communityId?: string;
  personId?: string;
  isEdit?: boolean;
}

export interface UseAnalyticsOptions {
  screenType?: ANALYTICS_SCREEN_TYPES;
  includeAssignmentType?: boolean;
  includeSectionType?: boolean;
  includeEditMode?: boolean;
  includePermissionType?: boolean;
}

export const useAnalytics = (
  screenName: string | string[],
  { communityId = '', personId = '', isEdit = false }: UseAnalyticsParams = {},
  {
    screenType = ANALYTICS_SCREEN_TYPES.screen,
    includeAssignmentType,
    includeSectionType,
    includeEditMode,
    includePermissionType,
  }: UseAnalyticsOptions = {},
) => {
  const myId = useMyId();
  const isMe = useIsMe(personId);
  const isOnboarding = useIsOnboarding();

  const {
    data: { community: { people: { edges = [] } = {} } = {} } = {},
  } = useQuery<getMyCommunityPermission>(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      id: communityId,
      myId,
    },
    fetchPolicy: 'cache-first',
  });

  let screenContext: Partial<ScreenContext> = {};
  if (includeAssignmentType) {
    screenContext = {
      ...screenContext,
      [ANALYTICS_ASSIGNMENT_TYPE]: getAnalyticsAssignmentType(
        isMe,
        !!communityId,
      ),
    };
  }
  if (includeSectionType) {
    screenContext = {
      ...screenContext,
      [ANALYTICS_SECTION_TYPE]: getAnalyticsSectionType(isOnboarding),
    };
  }
  if (includeEditMode) {
    screenContext = {
      ...screenContext,
      [ANALYTICS_EDIT_MODE]: getAnalyticsEditMode(isEdit),
    };
  }
  if (includePermissionType) {
    screenContext = {
      ...screenContext,
      [ANALYTICS_PERMISSION_TYPE]: getAnalyticsPermissionType(
        edges[0].communityPermission.permission,
      ),
    };
  }

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isDrawerOpen = useSelector(
    ({ drawer }: { drawer: DrawerState }) => drawer.isOpen,
  );

  const handleScreenChange = (
    name: string | string[],
    context?: Partial<ScreenContext>,
  ) => {
    dispatch(trackScreenChange(name, context));
  };

  //normally screens should only respond to focus events
  useEffect(() => {
    if (isFocused && screenType === ANALYTICS_SCREEN_TYPES.screen) {
      handleScreenChange(screenName, screenContext);
    }
  }, [isFocused]);

  //if it is a drawer, or screen with a drawer, it should respond to drawer events in addition to focus events
  useEffect(() => {
    if (isFocused) {
      if (screenType === ANALYTICS_SCREEN_TYPES.drawer && isDrawerOpen) {
        handleScreenChange(screenName, screenContext);
      } else if (
        screenType === ANALYTICS_SCREEN_TYPES.screenWithDrawer &&
        !isDrawerOpen
      ) {
        handleScreenChange(screenName, screenContext);
      }
    }
  }, [isFocused, isDrawerOpen]);

  return handleScreenChange;
};
