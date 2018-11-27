import React from 'react';

import GroupChallenges, { mapStateToProps } from '../GroupChallenges';
import {
  renderShallow,
  testSnapshotShallow,
  createMockStore,
} from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { challengesSelector } from '../../../selectors/challenges';
import * as challenges from '../../../actions/challenges';
import * as common from '../../../utils/common';
import * as navigation from '../../../actions/navigation';
import { ADD_CHALLENGE_SCREEN } from '../../AddChallengeScreen';
import { orgPermissionSelector } from '../../../selectors/people';
import { ORG_PERMISSIONS } from '../../../constants';

jest.mock('../../../selectors/people');
jest.mock('../../../selectors/organizations');
jest.mock('../../../selectors/challenges');
jest.mock('../../../actions/challenges');

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
};
const challenge2 = {
  id: '2',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Past Challenge',
  end_date: date,
  accepted_count: 5,
  completed_count: 3,
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
