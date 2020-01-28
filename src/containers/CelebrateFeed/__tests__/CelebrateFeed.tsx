import React from 'react';
import { MockList } from 'graphql-tools';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { useQuery } from '@apollo/react-hooks';

import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { Organization } from '../../../reducers/organizations';
import { Person } from '../../../reducers/people';

import CelebrateFeed, { GET_CELEBRATE_FEED } from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/organizations');
jest.mock('../../../components/common', () => ({
  DateComponent: 'DateComponent',
}));
jest.mock('../../../components/CelebrateItem', () => 'CelebrateItem');
jest.mock('../../Groups/ShareStoryInput', () => 'ShareStoryInput');
jest.mock('../../CelebrateFeedHeader', () => 'CelebrateFeedHeader');

const myId = '123';
const organization: Organization = { id: '456' };
const person: Person = { id: '789' };

const navigatePushResult = { type: 'navigated' };

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  ((organizationSelector as unknown) as jest.Mock).mockReturnValue(
    organization,
  );
  jest.useFakeTimers();
});

it('renders empty correctly', () => {
  renderWithContext(
    <CelebrateFeed organization={organization} itemNamePressable={true} />,
    {
      initialState: {
        auth: { person: { id: myId } },
        organizations: { all: [organization] },
        reportedComments: { all: { [organization.id]: [] } },
        swipe: { groupOnboarding: {} },
      },
      mocks: {
        CommunityCelebrationItemConnection: () => ({
          nodes: () => new MockList(10),
        }),
      },
    },
  ).snapshot();
});

it('renders with celebration items correctly', async () => {
  const { snapshot } = renderWithContext(
    <CelebrateFeed organization={organization} itemNamePressable={true} />,
    {
      initialState: {
        auth: { person: { id: myId } },
        organizations: { all: [organization] },
        reportedComments: { all: { [organization.id]: [] } },
        swipe: { groupOnboarding: {} },
      },
      mocks: {
        CommunityCelebrationItemConnection: () => ({
          nodes: () => new MockList(10),
        }),
      },
    },
  );

  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_CELEBRATE_FEED, {
    pollInterval: 30000,
    variables: {
      communityId: organization.id,
      hasUnreadComments: undefined,
      personIds: undefined,
    },
  });
});

describe('renders for member', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        person={person}
        itemNamePressable={true}
      />,
      {
        initialState: {
          auth: { person: { id: myId } },
          organizations: { all: [organization] },
          reportedComments: { all: { [organization.id]: [] } },
          swipe: { groupOnboarding: {} },
        },
        mocks: {
          CommunityCelebrationItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_CELEBRATE_FEED, {
      pollInterval: 30000,
      variables: {
        communityId: organization.id,
        hasUnreadComments: undefined,
        personIds: [person.id],
      },
    });
  });

  it('renders without header', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        person={person}
        itemNamePressable={true}
        noHeader={true}
      />,
      {
        initialState: {
          auth: { person: { id: myId } },
          organizations: { all: [organization] },
          reportedComments: { all: { [organization.id]: [] } },
          swipe: { groupOnboarding: {} },
        },
        mocks: {
          CommunityCelebrationItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_CELEBRATE_FEED, {
      pollInterval: 30000,
      variables: {
        communityId: organization.id,
        hasUnreadComments: undefined,
        personIds: [person.id],
      },
    });
  });
});

describe('renders with clear notification', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        itemNamePressable={true}
        onClearNotification={jest.fn()}
      />,
      {
        initialState: {
          auth: { person: { id: myId } },
          organizations: { all: [organization] },
          reportedComments: { all: { [organization.id]: [] } },
          swipe: { groupOnboarding: {} },
        },
        mocks: {
          CommunityCelebrationItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_CELEBRATE_FEED, {
      pollInterval: 30000,
      variables: {
        communityId: organization.id,
        hasUnreadComments: undefined,
        personIds: undefined,
      },
    });
  });
});

describe('renders for Unread Comments', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        itemNamePressable={true}
        showUnreadOnly={true}
      />,
      {
        initialState: {
          auth: { person: { id: myId } },
          organizations: { all: [organization] },
          reportedComments: { all: { [organization.id]: [] } },
          swipe: { groupOnboarding: {} },
        },
        mocks: {
          CommunityCelebrationItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_CELEBRATE_FEED, {
      pollInterval: 30000,
      variables: {
        communityId: organization.id,
        hasUnreadComments: true,
        personIds: undefined,
      },
    });
  });
});
