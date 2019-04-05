import React from 'react';
import MockDate from 'mockdate';
import configureStore from 'redux-mock-store';

import GroupUnreadFeed from '../GroupUnreadFeed';
import { renderShallow, createMockNavState } from '../../../../testUtils';
import * as common from '../../../utils/common';
import { navigateBack } from '../../../actions/navigation';
import { ACCEPTED_STEP } from '../../../constants';
import { celebrationSelector } from '../../../selectors/celebration';
import { organizationSelector } from '../../../selectors/organizations';
import { getGroupCelebrateFeedUnread } from '../../../actions/celebration';
import { markCommentsRead } from '../../../actions/unreadComments';
import { refreshCommunity } from '../../../actions/organizations';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/celebration');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/organizations');

MockDate.set('2017-06-18');
const org = { id: 'orgId' };
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

const items = [
  {
    id: '1',
    date: celebrate1.changed_attribute_value,
    events: [celebrate1],
  },
  {
    id: '2',
    date: celebrate2.changed_attribute_value,
    events: [celebrate2],
  },
];

const mockStore = configureStore();
let store;

const storeData = {
  organizations: {
    all: [org],
  },
};

getGroupCelebrateFeedUnread.mockReturnValue({
  type: 'getGroupCelebrateFeedUnread',
});
navigateBack.mockReturnValue({ type: 'navigateBack' });
markCommentsRead.mockReturnValue({ type: 'markCommentsRead' });
refreshCommunity.mockReturnValue({ type: 'refreshCommunity' });

const buildScreen = () => {
  const component = renderShallow(
    <GroupUnreadFeed navigation={createMockNavState({ organization: org })} />,
    store,
  );
  component.setState({ items });
  component.update();
  return component;
};

beforeEach(() => {
  store = mockStore(storeData);
  organizationSelector.mockReturnValue(org);
  celebrationSelector.mockReturnValue(items);
});

it('should render items correctly', () => {
  const component = buildScreen();
  expect(component).toMatchSnapshot();
});

it('should render empty correctly', () => {
  const component = buildScreen();
  component.setState({ items: [] });
  component.update();
  expect(component).toMatchSnapshot();
});

it('should call navigate back', () => {
  const component = buildScreen();

  component
    .childAt(1)
    .props()
    .right.props.onPress();
  expect(navigateBack).toHaveBeenCalled();
});

it('should mount', async () => {
  const component = buildScreen();
  await component.instance().loadItems();
  expect(refreshCommunity).toHaveBeenCalledWith(org.id);
  expect(getGroupCelebrateFeedUnread).toHaveBeenCalledWith(org.id);
  expect(markCommentsRead).toHaveBeenCalledWith(org.id);
});

it('should refresh correctly', async () => {
  const component = buildScreen();
  const instance = component.instance();
  instance.loadItems = jest.fn(() => Promise.resolve());

  await component
    .childAt(2)
    .childAt(0)
    .props()
    .refreshCallback();

  expect(instance.loadItems).toHaveBeenCalled();
});

it('should refresh items properly', () => {
  const component = buildScreen();
  const instance = component.instance();

  common.refresh = jest.fn();
  instance.refreshItems();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.loadItems);
});
