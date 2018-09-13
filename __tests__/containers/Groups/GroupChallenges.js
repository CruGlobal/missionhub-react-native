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
// import { reloadGroupChallengesFeed } from '../../../src/actions/challenges';
import * as common from '../../../src/utils/common';

jest.mock('../../../src/selectors/organizations');
jest.mock('../../../src/selectors/challenges');
jest.mock('../../../src/actions/challenges');

const date = '2018-09-06T14:13:21Z';
const challenge1 = {
  id: '1',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Read "There and Back Again"',
  end_date: date,
  accepted: 5,
  completed: 3,
  days_remaining: 14,
};
const challenge2 = {
  id: '2',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Past Challenge',
  end_date: date,
  accepted: 5,
  completed: 3,
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

const store = {
  organizations: {
    all: [org],
  },
};

describe('mapStateToProps', () => {
  it('provides props correctly', () => {
    organizationSelector.mockReturnValue(org);
    challengesSelector.mockReturnValue(challengeSelectorReturnValue);

    expect(mapStateToProps(store, { organization: org })).toEqual({
      challengeItems: challengeSelectorReturnValue,
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
  challengesSelector.mockReturnValue([]);
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
  component.props().refreshCallback();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.reloadItems);
});
