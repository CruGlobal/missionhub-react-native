import { PermissionEnum } from '../../../__generated__/globalTypes';
import {
  getAnalyticsAssignmentType,
  getAnalyticsSectionType,
  getAnalyticsEditMode,
  getAnalyticsPermissionType,
} from '../analytics';

describe('getAnalyticsAssignmentType', () => {
  it('returns self with no community', () => {
    expect(getAnalyticsAssignmentType(true, false)).toEqual('self');
  });

  it('returns self with community', () => {
    expect(getAnalyticsAssignmentType(true, true)).toEqual('self');
  });

  it('returns contact', () => {
    expect(getAnalyticsAssignmentType(false, false)).toEqual('contact');
  });

  it('returns community member', () => {
    expect(getAnalyticsAssignmentType(false, true)).toEqual('community member');
  });
});

describe('getAnalyticsSectionType', () => {
  it('returns onboarding', () => {
    expect(getAnalyticsSectionType(true)).toEqual('onboarding');
  });

  it('returns empty', () => {
    expect(getAnalyticsSectionType(false)).toEqual('');
  });
});

describe('getAnalyticsEditMode', () => {
  it('returns update', () => {
    expect(getAnalyticsEditMode(true)).toEqual('update');
  });

  it('returns set', () => {
    expect(getAnalyticsEditMode(false)).toEqual('set');
  });
});

describe('getAnalyticsPermissionType', () => {
  it('returns owner from permission', () => {
    expect(getAnalyticsPermissionType(PermissionEnum.owner)).toEqual('owner');
  });

  it('returns admin from permission', () => {
    expect(getAnalyticsPermissionType(PermissionEnum.admin)).toEqual('admin');
  });

  it('returns member from permission', () => {
    expect(getAnalyticsPermissionType(PermissionEnum.user)).toEqual('member');
  });

  it('returns empty string if no permissions', () => {
    expect(getAnalyticsPermissionType(PermissionEnum.no_permissions)).toEqual(
      '',
    );
  });
});
