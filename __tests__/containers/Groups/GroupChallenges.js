import React from 'react';

import GroupChallenges, {
  mapStateToProps,
} from '../../../src/containers/Groups/GroupChallenges';
import {
  renderShallow,
  testSnapshotShallow,
  createMockStore,
} from '../../../testUtils';
import { organizationSelector } from '../../../src/selectors/organizations';
import { challengesSelector } from '../../../src/selectors/challenges';
import * as challenges from '../../../src/actions/challenges';
import * as common from '../../../src/utils/common';
import * as navigation from '../../../src/actions/navigation';
import { ADD_CHALLENGE_SCREEN } from '../../../src/containers/AddChallengeScreen';
import { orgPermissionSelector } from '../../../src/selectors/people';
import { ORG_PERMISSIONS } from '../../../src/constants';

jest.mock('../../../src/selectors/people');
jest.mock('../../../src/selectors/organizations');
jest.mock('../../../src/selectors/challenges');
jest.mock('../../../src/actions/challenges');

const orgPermission = { permission_id: ORG_PERMISSIONS.ADMIN };
orgPermissionSelector.mockReturnValue(orgPermission);

const date = '2018-09-06T14:13:21Z';
const challenge1 = {
  id: '1',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Read "There and Back Again"',
  end_date: date,
  accepted_count: 5,
  completed_count: 3,
  days_remaining: 14,
};
const challenge2 = {
  id: '2',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Past Challenge',
  end_date: date,
  accepted_count: 5,
  completed_count: 3,
  days_remaining: 0,
};

const challengePagination = {
  hasNextPage: true,
  page: 1,
};

const org = {
  id: '123',
  challengeItems: [challenge1, challenge2],
  challengePagination: challengePagination,
};

const challengeSelectorReturnValue = [
  {
    title: '',
    data: [challenge1],
  },
  {
    title: 'Past Challenge',
    data: [challenge2],
  },
];

const emptyChallengeSelectorReturnValue = [
  {
    title: '',
    data: [],
  },
  {
    title: 'Past Challenge',
    data: [],
  },
];

const store = {
  auth: {
    person: {
      organizational_permissions: [
        {
          organization_id: org.id,
          permission_id: ORG_PERMISSIONS.ADMIN,
        },
      ],
    },
  },
  organizations: {
    all: [org],
  },
};

beforeEach(() => {
  challengesSelector.mockReturnValue(challengeSelectorReturnValue);
});

describe('mapStateToProps', () => {
  it('provides props correctly', () => {
    organizationSelector.mockReturnValue(org);

    expect(mapStateToProps(store, { organization: org })).toEqual({
      challengeItems: challengeSelectorReturnValue,
      myOrgPermissions: {
        permission_id: 1,
      },
      pagination: challengePagination,
    });
  });
});

it('should render correctly', () => {
  testSnapshotShallow(
    <GroupChallenges organization={org} store={createMockStore(store)} />,
  );
});

it('should render empty correctly', () => {
  challengesSelector.mockReturnValue(emptyChallengeSelectorReturnValue);
  testSnapshotShallow(
    <GroupChallenges organization={org} store={createMockStore(store)} />,
  );
});

it('should refresh items properly', () => {
  const component = renderShallow(
    <GroupChallenges organization={org} store={createMockStore(store)} />,
    store,
  );

  const instance = component.instance();
  common.refresh = jest.fn();
  component
    .childAt(0)
    .props()
    .refreshCallback();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.reloadItems);
});

it('should call create', () => {
  const component = renderShallow(
    <GroupChallenges organization={org} store={createMockStore(store)} />,
    store,
  );

  const instance = component.instance();
  instance.createChallenge = jest.fn();
  navigation.navigatePush = jest.fn(() => ({ type: 'push' }));

  component
    .childAt(1)
    .childAt(0)
    .props()
    .onPress();

  expect(navigation.navigatePush).toHaveBeenCalledWith(ADD_CHALLENGE_SCREEN, {
    onComplete: expect.any(Function),
  });
});

it('should call API to create', () => {
  const instance = renderShallow(
    <GroupChallenges organization={org} store={createMockStore(store)} />,
    store,
  ).instance();
  challenges.createChallenge = jest.fn(() => ({ type: 'create' }));

  const challenge = { id: '1', title: 'Test Challenge' };
  instance.createChallenge(challenge);

  expect(challenges.createChallenge).toHaveBeenCalledWith(challenge, org.id);
});
