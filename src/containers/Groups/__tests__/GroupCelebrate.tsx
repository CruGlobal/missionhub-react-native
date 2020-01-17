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
import { orgPermissionSelector } from '../../../selectors/people';
import * as common from '../../../utils/common';
import {
  INTERACTION_TYPES,
  CELEBRATEABLE_TYPES,
  ORG_PERMISSIONS,
  GLOBAL_COMMUNITY_ID,
} from '../../../constants';

jest.mock('../../../actions/organizations');
jest.mock('../../../actions/celebration');
jest.mock('../../../actions/reportComments');
jest.mock('../../../selectors/people');

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

const myId = '123';
const orgId = '1';
const org = {
  id: orgId,
  user_created: false,
  celebrateItems: [celebrate1, celebrate2, celebrate3],
  celebratePagination: celebratePagination,
};

const store = { organizations: { all: [org] }, auth: { person: { id: myId } } };

beforeEach(() => {
  // @ts-ignore
  getReportedComments.mockReturnValue(() => ({
    type: 'got repoerted comments',
  }));
  // @ts-ignore
  reloadGroupCelebrateFeed.mockReturnValue(() => Promise.resolve());
  // @ts-ignore
  getGroupCelebrateFeed.mockReturnValue({ type: 'got group celebrate feed' });
  // @ts-ignore
  refreshCommunity.mockReturnValue({ type: 'refreshed community' });
  // @ts-ignore
  orgPermissionSelector.mockReturnValue({
    permission_id: ORG_PERMISSIONS.USER,
  });
});

it('should render correctly', () => {
  testSnapshotShallow(
    // @ts-ignore
    <GroupCelebrate orgId={orgId} store={createThunkStore(store)} />,
  );
});

it('should render empty correctly', () => {
  testSnapshotShallow(
    <GroupCelebrate
      orgId={orgId}
      // @ts-ignore
      store={createThunkStore({
        ...store,
        organizations: { all: [{ ...org, celebrateItems: [] }] },
      })}
    />,
  );
});

describe('refresh items', () => {
  // @ts-ignore
  let testOrg;

  const testRefresh = () =>
    renderShallow(
      <GroupCelebrate
        // @ts-ignore
        orgId={testOrg.id}
        // @ts-ignore
        store={createThunkStore({
          ...store,
          // @ts-ignore
          organizations: { all: [testOrg] },
        })}
      />,
    )
      .childAt(1)
      .props()
      .refreshCallback();

  describe('owner', () => {
    beforeEach(() => {
      // @ts-ignore
      orgPermissionSelector.mockReturnValue({
        permission_id: ORG_PERMISSIONS.OWNER,
      });
    });

    describe('user created community', () => {
      it('should refresh correctly', async () => {
        testOrg = { ...org, user_created: true };
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
        expect(getReportedComments).toHaveBeenCalledWith(org.id);
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(org.id);
      });
    });
    describe('cru community', () => {
      it('should refresh correctly', async () => {
        testOrg = org;
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
        expect(getReportedComments).toHaveBeenCalledWith(org.id);
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(org.id);
      });
    });
    describe('global community', () => {
      it('should refresh correctly', async () => {
        testOrg = { ...org, id: GLOBAL_COMMUNITY_ID };
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
        expect(getReportedComments).not.toHaveBeenCalled();
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(
          GLOBAL_COMMUNITY_ID,
        );
      });
    });
  });

  describe('admin', () => {
    beforeEach(() => {
      // @ts-ignore
      orgPermissionSelector.mockReturnValue({
        permission_id: ORG_PERMISSIONS.ADMIN,
      });
    });

    describe('user created community', () => {
      it('should refresh correctly', async () => {
        testOrg = { ...org, user_created: true };
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
        expect(getReportedComments).not.toHaveBeenCalled();
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(org.id);
      });
    });
    describe('cru community', () => {
      it('should refresh correctly', async () => {
        testOrg = org;
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
        expect(getReportedComments).toHaveBeenCalledWith(org.id);
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(org.id);
      });
    });
    describe('global community', () => {
      it('should refresh correctly', async () => {
        testOrg = { ...org, id: GLOBAL_COMMUNITY_ID };
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
        expect(getReportedComments).not.toHaveBeenCalled();
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(
          GLOBAL_COMMUNITY_ID,
        );
      });
    });
  });

  describe('member', () => {
    beforeEach(() => {
      // @ts-ignore
      orgPermissionSelector.mockReturnValue({
        permission_id: ORG_PERMISSIONS.USER,
      });
    });

    describe('user created community', () => {
      it('should refresh correctly', async () => {
        testOrg = { ...org, user_created: true };
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
        expect(getReportedComments).not.toHaveBeenCalled();
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(org.id);
      });
    });
    describe('cru community', () => {
      it('should refresh correctly', async () => {
        testOrg = org;
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
        expect(getReportedComments).not.toHaveBeenCalled();
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(org.id);
      });
    });
    describe('global community', () => {
      it('should refresh correctly', async () => {
        testOrg = { ...org, id: GLOBAL_COMMUNITY_ID };
        await testRefresh();

        expect(refreshCommunity).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
        expect(getReportedComments).not.toHaveBeenCalled();
        expect(reloadGroupCelebrateFeed).toHaveBeenCalledWith(
          GLOBAL_COMMUNITY_ID,
        );
      });
    });
  });
});

it('should refresh items properly', () => {
  const instance = renderShallow(
    // @ts-ignore
    <GroupCelebrate orgId={orgId} store={createThunkStore(store)} />,
    // @ts-ignore
    store,
  ).instance();

  // @ts-ignore
  common.refresh = jest.fn();
  instance.refreshItems();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.reloadItems);
});
