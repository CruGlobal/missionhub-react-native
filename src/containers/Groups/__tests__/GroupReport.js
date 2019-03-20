import React from 'react';
import MockDate from 'mockdate';

import GroupReport from '../GroupReport';
import {
  renderShallow,
  createMockNavState,
  createMockStore,
} from '../../../../testUtils';
import {
  getReportedComments,
  deleteCelebrateComment,
  ignoreReportComment,
} from '../../../actions/celebrateComments';
import * as common from '../../../utils/common';
import { navigateBack } from '../../../actions/navigation';

jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/navigation');

MockDate.set('2017-06-18');
const event = { id: 'eventId' };
const comment = {
  id: 'comment1',
  organization_celebration_item: event,
};
const person = {
  id: 'person1',
  full_name: 'person full name',
};
const report1 = {
  id: 'report1',
  comment,
  person,
};

const org = { id: 'orgId' };
let store;
const mockStore = {
  organizations: {
    all: [org],
  },
  reportedComments: {
    all: { [org.id]: [report1] },
  },
};

deleteCelebrateComment.mockReturnValue({ type: 'delete comment' });
ignoreReportComment.mockReturnValue({ type: 'ignore comment' });
navigateBack.mockReturnValue({ type: 'navigate back' });

beforeEach(() => {
  store = createMockStore(mockStore);
});

it('should render correctly', () => {
  const component = renderShallow(
    <GroupReport navigation={createMockNavState({ organization: org })} />,
    store,
  );
  expect(component).toMatchSnapshot();
});

it('should render empty correctly', () => {
  store = createMockStore({ ...mockStore, reportedComments: { all: {} } });
  const component = renderShallow(
    <GroupReport navigation={createMockNavState({ organization: org })} />,
    store,
  );
  expect(component).toMatchSnapshot();
});

it('should call navigate back', () => {
  store = createMockStore({ ...mockStore, reportedComments: { all: {} } });
  const component = renderShallow(
    <GroupReport navigation={createMockNavState({ organization: org })} />,
    store,
  );
  component
    .childAt(0)
    .props()
    .right.props.onPress();
  expect(navigateBack).toHaveBeenCalled();
});

it('should refresh correctly', async () => {
  const component = renderShallow(
    <GroupReport navigation={createMockNavState({ organization: org })} />,
    store,
  );

  await component
    .childAt(1)
    .childAt(0)
    .props()
    .refreshControl.props.onRefresh();

  expect(getReportedComments).toHaveBeenCalledWith(org.id);
});

it('should refresh items properly', () => {
  const instance = renderShallow(
    <GroupReport navigation={createMockNavState({ organization: org })} />,
    store,
  ).instance();

  common.refresh = jest.fn();
  instance.refreshItems();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.loadItems);
});

describe('report item', () => {
  store = createMockStore(mockStore);
  const component = renderShallow(
    <GroupReport navigation={createMockNavState({ organization: org })} />,
    store,
  );

  it('render row', () => {
    const item = component
      .childAt(1)
      .childAt(0)
      .props()
      .renderItem({ item: report1 });
    expect(item).toMatchSnapshot();
  });
});
