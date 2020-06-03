import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../constants';
import { TrackStateContext } from '../actions/analytics';
import { OnboardingState } from '../reducers/onboarding';
import { PermissionEnum } from '../../__generated__/globalTypes';
import { apolloClient } from '../apolloClient';
import { GET_MY_COMMUNITY_PERMISSION_QUERY } from '../containers/Groups/CreatePostButton/queries';
import { getMyCommunityPermission } from '../containers/Groups/CreatePostButton/__generated__/getMyCommunityPermission';

import { isOnboarding } from './common';

export const getAnalyticsAssignmentType = (
  personId: string,
  myId: string,
  communityId?: string,
): TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE] =>
  personId === myId ? 'self' : communityId ? 'community member' : 'contact';

export const getAnalyticsSectionType = (
  onboardingState: OnboardingState,
): TrackStateContext[typeof ANALYTICS_SECTION_TYPE] =>
  isOnboarding(onboardingState) ? 'onboarding' : '';

export const getAnalyticsEditMode = (
  isEdit: boolean,
): TrackStateContext[typeof ANALYTICS_EDIT_MODE] => (isEdit ? 'update' : 'set');

export const getAnalyticsPermissionType = (
  permission?: PermissionEnum,
): TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE] => {
  switch (permission) {
    case PermissionEnum.owner:
    case PermissionEnum.admin:
      return permission;
    case PermissionEnum.user:
      return 'member';
    default:
      return '';
  }
};
