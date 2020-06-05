import { PermissionEnum } from '../../../__generated__/globalTypes';
import {
  getAnalyticsAssignmentType,
  getAnalyticsSectionType,
  getAnalyticsEditMode,
  getAnalyticsPermissionType,
} from '../analytics';

describe('getAnalyticsAssignmentType', () => {
  let isMe = true;
  let isInCommunity = true;

  it('returns self', () => {
    isMe = true;
    isInCommunity = false;
    expect(getAnalyticsAssignmentType(isMe, isInCommunity)).toEqual('self');
  });

  it('returns contact', () => {
    isMe = false;
    isInCommunity = false;
    expect(getAnalyticsAssignmentType(isMe, isInCommunity)).toEqual('contact');
  });

  it('returns community member', () => {
    isMe = false;
    isInCommunity = true;
    expect(getAnalyticsAssignmentType(isMe, isInCommunity)).toEqual(
      'community member',
    );
  });
});

describe('getAnalyticsSectionType', () => {
  it('returns self', () => {
    expect(getAnalyticsSectionType(true)).toEqual('onboarding');
  });

  it('returns contact', () => {
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
});
