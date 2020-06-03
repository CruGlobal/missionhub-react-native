import { useEffect } from 'react';
import { useIsFocused } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { trackScreenChange, ScreenContext } from '../../actions/analytics';
import { DrawerState } from '../../reducers/drawer';
import { apolloClient } from '../../apolloClient';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../../containers/Groups/CreatePostButton/queries';
import { getMyCommunityPermission } from '../../containers/Groups/CreatePostButton/__generated__/getMyCommunityPermission';
import {
  getAnalyticsPermissionType,
  getAnalyticsAssignmentType,
} from '../analytics';

export enum ANALYTICS_SCREEN_TYPES {
  screen,
  screenWithDrawer,
  drawer,
}

interface UseAnalyticsOptions {
  screenType?: ANALYTICS_SCREEN_TYPES;
  screenContext?: Partial<ScreenContext>;
}

export const useAnalytics = async (
  screenName: string | string[],
  {
    screenType = ANALYTICS_SCREEN_TYPES.screen,
    screenContext,
  }: UseAnalyticsOptions = {},
) => {
  const communityId = '1111';
  const personId = '2222';

  const {} = apolloClient.readFragment({
    fragment: gql`
    fragment stepReceiver on Step {
      receiver {
        id
      }
  `,
  });

  const {
    data: { community: { people: { edges = [] } = {} } = {} } = {},
  } = useQuery<getMyCommunityPermission>(GET_MY_COMMUNITY_PERMISSION_QUERY, {
    variables: {
      communityId,
      personId,
    },
    fetchPolicy: 'cache-first',
  });

  const assignmentType = getAnalyticsAssignmentType(
    personId,
    myId,
    communityId,
  );
  const permissionType = getAnalyticsPermissionType(
    edges[0].communityPermission.permission,
  );

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
