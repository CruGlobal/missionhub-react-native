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

// @ts-ignore
getGroupChallengeFeed.mockReturnValue({ type: 'got group challenge feed' });

it('should render correctly', () => {
  testSnapshotShallow(
    // @ts-ignore
    <GroupChallenges orgId={orgId} store={createThunkStore(store)} />,
  );
});

it('should render correctly for basic member', () => {
  testSnapshotShallow(
    <GroupChallenges
      orgId={orgId}
      // @ts-ignore
      store={createThunkStore({
        ...store,
        auth: {
          person: {
            organizational_permissions: [
              {
                organization_id: org.id,
                permission_id: ORG_PERMISSIONS.USER,
              },
            ],
          },
        },
      })}
    />,
  );
});

it('should render empty correctly', () => {
  testSnapshotShallow(
    <GroupChallenges
      orgId={orgId}
      // @ts-ignore
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
    // @ts-ignore
    <GroupChallenges orgId={orgId} store={createThunkStore(store)} />,
    // @ts-ignore
    store,
  );

  const instance = component.instance();
  // @ts-ignore
  common.refresh = jest.fn();
  component
    .childAt(1)
    .childAt(0)
    .props()
    .refreshCallback();

  // @ts-ignore
  expect(common.refresh).toHaveBeenCalledWith(instance, instance.reloadItems);
});

it('should call create', () => {
  const component = renderShallow(
    // @ts-ignore
    <GroupChallenges orgId={orgId} store={createThunkStore(store)} />,
    // @ts-ignore
    store,
  );

  const instance = component.instance();
  const challenge = { id: '1', title: 'Test Challenge' };
  // @ts-ignore
  instance.createChallenge = jest.fn();

  (navigation.navigatePush as jest.Mock) = jest.fn(() => ({ type: 'push' }));
  (createChallenge as jest.Mock).mockReturnValue({ type: 'create' });
  component
    .childAt(2)
    .props()
    .onPress();

  expect(navigation.navigatePush).toHaveBeenCalledWith(ADD_CHALLENGE_SCREEN, {
    onComplete: expect.any(Function),
    organization: org,
  });
  (navigation.navigatePush as jest.Mock).mock.calls[0][1].onComplete(challenge);
  // @ts-ignore
  expect(instance.createChallenge).toHaveBeenCalledWith(challenge);
});

it('should call API to create', () => {
  const instance = renderShallow(
    // @ts-ignore
    <GroupChallenges orgId={orgId} store={createThunkStore(store)} />,
    // @ts-ignore
    store,
  ).instance();
  // @ts-ignore
  createChallenge.mockReturnValue({ type: 'create' });

  const challenge = { id: '1', title: 'Test Challenge' };
  instance.createChallenge(challenge);

  expect(createChallenge).toHaveBeenCalledWith(challenge, org.id);
});
