import React from 'react';
import MockDate from 'mockdate';

import GroupChallenges from '../GroupChallenges';
import {
  renderShallow,
  testSnapshotShallow,
  createThunkStore,
} from '../../../../testUtils';
import {
  getGroupChallengeFeed,
  createChallenge,
} from '../../../actions/challenges';
import * as common from '../../../utils/common';
import * as navigation from '../../../actions/navigation';
import { ADD_CHALLENGE_SCREEN } from '../../AddChallengeScreen';
import { ORG_PERMISSIONS } from '../../../constants';

jest.mock('../../../actions/challenges');

const mockDate = '2018-09-01';
const futureDate = '2018-10-06T14:13:21Z';
const pastDate = '2018-07-06T14:13:21Z';
MockDate.set(mockDate);

const challenge1 = {
  id: '1',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Read "There and Back Again"',
  end_date: futureDate,
  accepted_count: 5,
  completed_count: 3,
};
const challenge2 = {
  id: '2',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Past Challenge',
  end_date: pastDate,
  accepted_count: 5,
  completed_count: 3,
};

const challengePagination = {
  hasNextPage: true,
  page: 1,
};

const orgId = '123';
const org = {
  id: orgId,
  challengeItems: [challenge1, challenge2],
  challengePagination: challengePagination,
};

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

getGroupChallengeFeed.mockReturnValue({ type: 'got group challenge feed' });

it('should render correctly', () => {
  testSnapshotShallow(
    <GroupChallenges orgId={orgId} store={createThunkStore(store)} />,
  );
});

it('should render empty correctly', () => {
  testSnapshotShallow(
    <GroupChallenges
      orgId={orgId}
      store={createThunkStore({
        ...store,
        organizations: {
          all: [
            {
              ...org,
              challengeItems: [],
            },
          ],
        },
      })}
    />,
  );
});

it('should refresh items properly', () => {
  const component = renderShallow(
    <GroupChallenges orgId={orgId} store={createThunkStore(store)} />,
    store,
  );

  const instance = component.instance();
  common.refresh = jest.fn();
  component
    .childAt(0)
    .childAt(0)
    .props()
    .refreshCallback();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.reloadItems);
});

it('should call create', () => {
  const component = renderShallow(
    <GroupChallenges orgId={orgId} store={createThunkStore(store)} />,
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
    <GroupChallenges orgId={orgId} store={createThunkStore(store)} />,
    store,
  ).instance();
  createChallenge.mockReturnValue({ type: 'create' });

  const challenge = { id: '1', title: 'Test Challenge' };
  instance.createChallenge(challenge);

  expect(createChallenge).toHaveBeenCalledWith(challenge, org.id);
});
