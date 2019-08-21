import React from 'react';
import MockDate from 'mockdate';

import GroupCelebrate from '../GroupCelebrate';
import {
  renderShallow,
  testSnapshotShallow,
  createThunkStore,
} from '../../../../testUtils';
import {
  reloadGroupCelebrateFeed,
  getGroupCelebrateFeed,
} from '../../../actions/celebration';
import { getReportedComments } from '../../../actions/reportComments';
import { refreshCommunity } from '../../../actions/organizations';
import * as common from '../../../utils/common';
import { INTERACTION_TYPES, CELEBRATEABLE_TYPES } from '../../../constants';

jest.mock('../../../actions/organizations');
jest.mock('../../../actions/celebration');
jest.mock('../../../actions/reportComments');

MockDate.set('2017-06-18');
const celebrate1 = {
  id: '10',
  celebrateable_type: CELEBRATEABLE_TYPES.completedInteraction,
  changed_attribute_value: '2018-06-11 00:00:00 UTC',
  adjective_attribute_value:
    INTERACTION_TYPES.MHInteractionTypeDiscipleshipConversation.id,
};
const celebrate2 = {
  id: '20',
  celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
  changed_attribute_value: '2018-06-10 00:00:00 UTC',
};
const celebrate3 = {
  id: '30',
  celebrateable_type: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
  changed_attribute_value: '2018-06-10 00:00:00 UTC',
};

const celebratePagination = {
  hasNextPage: true,
  page: 1,
};

const orgId = '1';
const org = {
  id: orgId,
  celebrateItems: [celebrate1, celebrate2, celebrate3],
  celebratePagination: celebratePagination,
};

const store = { organizations: { all: [org] } };

getReportedComments.mockReturnValue(() => ({ type: 'got repoerted comments' }));
reloadGroupCelebrateFeed.mockReturnValue(() => Promise.resolve());
getGroupCelebrateFeed.mockReturnValue({ type: 'got group celebrate feed' });
refreshCommunity.mockReturnValue({ type: 'refreshed community' });

it('should render correctly', () => {
  testSnapshotShallow(
    <GroupCelebrate orgId={orgId} store={createThunkStore(store)} />,
  );
});

it('should render empty correctly', () => {
  testSnapshotShallow(
    <GroupCelebrate
      orgId={orgId}
      store={createThunkStore({
        ...store,
        organizations: { all: [{ ...org, celebrateItems: [] }] },
      })}
    />,
  );
});

it('should refresh correctly', async () => {
  const component = renderShallow(
    <GroupCelebrate orgId={orgId} store={createThunkStore(store)} />,
    store,
  );

  await component
    .childAt(1)
    .props()
    .refreshCallback();

  expect(refreshCommunity).toHaveBeenCalledWith(org.id);
  expect(getReportedComments).toHaveBeenCalledWith(org.id);
  expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(org.id);
});

it('should refresh items properly', () => {
  const instance = renderShallow(
    <GroupCelebrate orgId={orgId} store={createThunkStore(store)} />,
    store,
  ).instance();

  common.refresh = jest.fn();
  instance.refreshItems();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.reloadItems);
});
