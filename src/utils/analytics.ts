import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_PERMISSION_TYPE,
  ANALYTICS_EDIT_MODE,
} from '../constants';
import { TrackStateContext } from '../actions/analytics';
import { PermissionEnum } from '../../__generated__/globalTypes';

export const getAnalyticsAssignmentType = (
  isMe: boolean,
  isInCommunity: boolean,
): TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE] =>
  isMe ? 'self' : isInCommunity ? 'community member' : 'contact';

export const getAnalyticsSectionType = (
  isOnboarding: boolean,
): TrackStateContext[typeof ANALYTICS_SECTION_TYPE] =>
  isOnboarding ? 'onboarding' : '';

export const getAnalyticsEditMode = (
  isEdit: boolean,
): TrackStateContext[typeof ANALYTICS_EDIT_MODE] => (isEdit ? 'update' : 'set');

export const getAnalyticsPermissionType = (
  permission?: PermissionEnum,
): TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE] => {
  switch (permission) {
    case PermissionEnum.owner:
      return 'owner';
    case PermissionEnum.admin:
      return 'admin';
    case PermissionEnum.user:
      return 'member';
    default:
      return '';
  }
};
