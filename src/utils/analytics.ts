import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../constants';
import { TrackStateContext } from '../actions/analytics';
import { AuthState } from '../reducers/auth';
import { OnboardingState } from '../reducers/onboarding';
import { orgPermissionSelector } from '../selectors/people';
import {
  PermissionEnum,
  PostTypeEnum,
  FeedItemSubjectTypeEnum,
} from '../../__generated__/globalTypes';

import {
  personIsCurrentUser,
  hasOrgPermissions,
  isOnboarding,
  isOwner,
  isAdmin,
} from './common';

export const getAnalyticsAssignmentType = (
  person: {
    id: string;
    organizational_permissions?: {
      organization_id: string;
      permission_id: string;
    }[];
  } | null,
  authState: AuthState,
  organization?: { id: string },
): TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE] => {
  const orgPermission = orgPermissionSelector({}, { person, organization });

  return person
    ? personIsCurrentUser(person.id, authState)
      ? 'self'
      : orgPermission && hasOrgPermissions(orgPermission)
      ? 'community member'
      : 'contact'
    : '';
};

export const getAnalyticsSectionType = (
  onboardingState: OnboardingState,
): TrackStateContext[typeof ANALYTICS_SECTION_TYPE] =>
  isOnboarding(onboardingState) ? 'onboarding' : '';

export const getAnalyticsEditMode = (
  isEdit: boolean,
): TrackStateContext[typeof ANALYTICS_EDIT_MODE] => (isEdit ? 'update' : 'set');

export const getAnalyticsPermissionType = (
  auth: AuthState,
  organization: { id: string },
): TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE] => {
  const orgPermission = orgPermissionSelector(
    {},
    { person: auth.person, organization },
  );

  return hasOrgPermissions(orgPermission)
    ? isOwner(orgPermission)
      ? 'owner'
      : isAdmin(orgPermission)
      ? 'admin'
      : 'member'
    : '';
};

export const getAnalyticsPermissionTypeGraphQL = (
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

export const getPostTypeAnalytics = (
  postType: PostTypeEnum | FeedItemSubjectTypeEnum,
) => {
  switch (postType) {
    case PostTypeEnum.story:
    case FeedItemSubjectTypeEnum.STORY:
      return 'god story';
    case PostTypeEnum.prayer_request:
    case FeedItemSubjectTypeEnum.PRAYER_REQUEST:
      return 'prayer request';
    case PostTypeEnum.question:
    case FeedItemSubjectTypeEnum.QUESTION:
      return 'spiritual question';
    case PostTypeEnum.help_request:
    case FeedItemSubjectTypeEnum.HELP_REQUEST:
      return 'care request';
    case PostTypeEnum.thought:
    case FeedItemSubjectTypeEnum.THOUGHT:
      return 'thoughts';
    case PostTypeEnum.announcement:
    case FeedItemSubjectTypeEnum.ANNOUNCEMENT:
      return 'announcement';
    case FeedItemSubjectTypeEnum.STEP:
      return 'steps of faith';
    default:
      return '';
  }
};
