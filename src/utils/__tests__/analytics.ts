import { ORG_PERMISSIONS } from '../../constants';
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';
import { PermissionEnum } from '../../../__generated__/globalTypes';
import {
  getAnalyticsAssignmentType,
  getAnalyticsSectionType,
  getAnalyticsEditMode,
  getAnalyticsPermissionType,
} from '../analytics';

describe('getAnalyticsAssignmentType', () => {
  const myId = '1';
  const otherId = '2';
  const organization = { id: '3' };
  const orgPermission = {
    organization_id: organization.id,
    permission_id: ORG_PERMISSIONS.USER,
  };
  const otherPerson = {
    id: otherId,
    organizational_permissions: [orgPermission],
  };
  const authState = {
    person: { id: myId },
  } as AuthState;

  it('returns self', () => {
    expect(getAnalyticsAssignmentType({ id: myId }, authState)).toEqual('self');
  });

  it('returns contact', () => {
    expect(getAnalyticsAssignmentType(otherPerson, authState)).toEqual(
      'contact',
    );
  });

  it('returns community member', () => {
    expect(
      getAnalyticsAssignmentType(otherPerson, authState, organization),
    ).toEqual('community member');
  });
});

describe('getAnalyticsSectionType', () => {
  it('returns self', () => {
    expect(
      getAnalyticsSectionType({ currentlyOnboarding: true } as OnboardingState),
    ).toEqual('onboarding');
  });

  it('returns contact', () => {
    expect(
      getAnalyticsSectionType({
        currentlyOnboarding: false,
      } as OnboardingState),
    ).toEqual('');
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
  const orgId = '6';
  const organization = { id: orgId };
  const orgPermission = { organization_id: orgId };

  it('returns owner from permission_id', () => {
    const auth = {
      person: {
        organizational_permissions: [
          { ...orgPermission, permission_id: ORG_PERMISSIONS.OWNER },
        ],
      },
    } as AuthState;

    expect(getAnalyticsPermissionType(auth, organization)).toEqual('owner');
  });

  it('returns owner from permission', () => {
    const auth = {
      person: {
        organizational_permissions: [
          { ...orgPermission, permission: PermissionEnum.owner },
        ],
      },
    } as AuthState;

    expect(getAnalyticsPermissionType(auth, organization)).toEqual('owner');
  });

  it('returns admin from permission_id', () => {
    const auth = {
      person: {
        organizational_permissions: [
          { ...orgPermission, permission_id: ORG_PERMISSIONS.ADMIN },
        ],
      },
    } as AuthState;

    expect(getAnalyticsPermissionType(auth, organization)).toEqual('admin');
  });

  it('returns admin from permission', () => {
    const auth = {
      person: {
        organizational_permissions: [
          { ...orgPermission, permission: PermissionEnum.admin },
        ],
      },
    } as AuthState;

    expect(getAnalyticsPermissionType(auth, organization)).toEqual('admin');
  });

  it('returns member from permission_id', () => {
    const auth = {
      person: {
        organizational_permissions: [
          { ...orgPermission, permission_id: ORG_PERMISSIONS.USER },
        ],
      },
    } as AuthState;

    expect(getAnalyticsPermissionType(auth, organization)).toEqual('member');
  });

  it('returns member from permission', () => {
    const auth = {
      person: {
        organizational_permissions: [
          { ...orgPermission, permission: PermissionEnum.user },
        ],
      },
    } as AuthState;

    expect(getAnalyticsPermissionType(auth, organization)).toEqual('member');
  });

  it('returns empty string if no permissions', () => {
    const auth = {
      person: {
        organizational_permissions: [
          { ...orgPermission, permission_id: ORG_PERMISSIONS.CONTACT },
        ],
      },
    } as AuthState;

    expect(getAnalyticsPermissionType(auth, organization)).toEqual('');
  });
});
