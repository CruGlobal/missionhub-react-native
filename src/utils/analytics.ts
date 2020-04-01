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
