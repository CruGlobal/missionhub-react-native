import React from 'react';
import MockDate from 'mockdate';

import GroupCelebrate, { mapStateToProps } from '../GroupCelebrate';
import {
  renderShallow,
  testSnapshotShallow,
  createThunkStore,
} from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { celebrationSelector } from '../../../selectors/celebration';
import {
  reloadGroupCelebrateFeed,
  getGroupCelebrateFeed,
} from '../../../actions/celebration';
import { getReportedComments } from '../../../actions/reportComments';
import { refreshCommunity } from '../../../actions/organizations';
import * as common from '../../../utils/common';
import { ACCEPTED_STEP } from '../../../constants';

jest.mock('../../../actions/organizations');
jest.mock('../../../selectors/organizations');
jest.mock('../../../selectors/celebration');
jest.mock('../../../actions/celebration');
jest.mock('../../../actions/reportComments');

MockDate.set('2017-06-18');
const celebrate1 = {
  id: '10',
  celebrateable_type: 'interaction',
  changed_attribute_value: '2018-06-11 00:00:00 UTC',
};
const celebrate2 = {
  id: '20',
  celebrateable_type: ACCEPTED_STEP,
  changed_attribute_value: '2018-06-10 00:00:00 UTC',
};
const celebrate3 = {
  id: '30',
  celebrateable_type: 'contact_assignment',
  changed_attribute_value: '2018-06-10 00:00:00 UTC',
};

const celebratePagination = {
  hasNextPage: true,
  page: 1,
};

const org = {
  id: '1',
  celebrateItems: [celebrate1, celebrate2, celebrate3],
  celebratePagination: celebratePagination,
};

const celebrateSelectorReturnValue = [
  {
    id: '1',
    date: celebrate1.changed_attribute_value,
    events: [celebrate1],
  },
  {
    id: '2',
    date: celebrate2.changed_attribute_value,
    events: [celebrate2, celebrate3],
  },
];

const store = {
  organizations: {
    all: [org],
  },
};

getReportedComments.mockReturnValue(() => ({ type: 'got repoerted comments' }));
reloadGroupCelebrateFeed.mockReturnValue(() => Promise.resolve());
getGroupCelebrateFeed.mockReturnValue({ type: 'got group celebrate feed' });
refreshCommunity.mockReturnValue({ type: 'refreshed community' });

describe('mapStateToProps', () => {
  it('provides props correctly', () => {
    organizationSelector.mockReturnValue(org);
    celebrationSelector.mockReturnValue(celebrateSelectorReturnValue);

    expect(mapStateToProps(store, { organization: org })).toEqual({
      celebrateItems: celebrateSelectorReturnValue,
      pagination: celebratePagination,
    });
  });
});

it('should render correctly', () => {
  testSnapshotShallow(
    <GroupCelebrate organization={org} store={createThunkStore(store)} />,
  );
});

it('should render empty correctly', () => {
  celebrationSelector.mockReturnValue([]);
  testSnapshotShallow(
    <GroupCelebrate organization={org} store={createThunkStore(store)} />,
  );
});

it('should refresh correctly', async () => {
  const component = renderShallow(
    <GroupCelebrate organization={org} store={createThunkStore(store)} />,
    store,
  );

  await component
    .childAt(0)
    .props()
    .refreshCallback();

  expect(refreshCommunity).toHaveBeenCalledWith(org.id);
  expect(getReportedComments).toHaveBeenCalledWith(org.id);
  expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(org.id);
});

it('should refresh items properly', () => {
  const instance = renderShallow(
    <GroupCelebrate organization={org} store={createThunkStore(store)} />,
    store,
  ).instance();

  common.refresh = jest.fn();
  instance.refreshItems();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.reloadItems);
});
