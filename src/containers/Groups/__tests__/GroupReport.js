import React from 'react';
import { Alert } from 'react-native';
import MockDate from 'mockdate';
import i18n from 'i18next';

import GroupReport from '../GroupReport';
import {
  renderShallow,
  createMockNavState,
  createMockStore,
} from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import {
  getReportedComments,
  deleteCelebrateComment,
  ignoreReportComment,
} from '../../../actions/celebrateComments';
import * as common from '../../../utils/common';
import { navigateBack } from '../../../actions/navigation';

jest.mock('../../../selectors/organizations');
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

const org = { id: 'orgId', reportedComments: [report1] };
let store;
const mockStore = {
  organizations: {
    all: [org],
  },
};

deleteCelebrateComment.mockReturnValue({ type: 'delete comment' });
ignoreReportComment.mockReturnValue({ type: 'ignore comment' });
navigateBack.mockReturnValue({ type: 'navigate back' });

beforeEach(() => {
  store = createMockStore(mockStore);
  organizationSelector.mockReturnValue(org);
});

it('should render correctly', () => {
  const component = renderShallow(
    <GroupReport
      organization={org}
      navigation={createMockNavState({ organization: org })}
    />,
    store,
  );
  expect(component).toMatchSnapshot();
});

it('should render empty correctly', () => {
  organizationSelector.mockReturnValue({ ...org, reportedComments: [] });
  const component = renderShallow(
    <GroupReport
      organization={org}
      navigation={createMockNavState({ organization: org })}
    />,
    store,
  );
  expect(component).toMatchSnapshot();
});

it('should call navigate back', () => {
  organizationSelector.mockReturnValue({ ...org, reportedComments: [] });
  const component = renderShallow(
    <GroupReport
      organization={org}
      navigation={createMockNavState({ organization: org })}
    />,
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
    <GroupReport
      organization={org}
      navigation={createMockNavState({ organization: org })}
    />,
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
    <GroupReport
      organization={org}
      navigation={createMockNavState({ organization: org })}
    />,
    store,
  ).instance();

  common.refresh = jest.fn();
  instance.refreshItems();

  expect(common.refresh).toHaveBeenCalledWith(instance, instance.loadItems);
});

describe('report item', () => {
  let component;
  const loadItems = jest.fn();
  beforeEach(() => {
    organizationSelector.mockReturnValue(org);
    Alert.alert = jest.fn((a, b, c) => c[1].onPress());
    component = renderShallow(
      <GroupReport
        organization={org}
        navigation={createMockNavState({ organization: org })}
      />,
      store,
    );
    component.instance().loadItems = loadItems;
  });

  it('call handleDelete', () => {
    expect(component).toMatchSnapshot();
  });

  it('call handleDelete', async () => {
    await component
      .childAt(1)
      .childAt(0)
      .props()
      .renderItem({ item: report1 })
      .props.onDelete(report1);

    expect(Alert.alert).toHaveBeenCalledWith(
      i18n.t('groupsReport:deleteTitle'),
      '',
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('ok'), onPress: expect.any(Function) },
      ],
    );
    expect(deleteCelebrateComment).toHaveBeenCalledWith(
      org.id,
      event,
      report1.comment,
    );
    expect(loadItems).toHaveBeenCalled();
  });

  it('call handleIgnore', async () => {
    await component
      .childAt(1)
      .childAt(0)
      .props()
      .renderItem({ item: report1 })
      .props.onIgnore(report1);

    expect(ignoreReportComment).toHaveBeenCalledWith(org.id, report1.id);
    expect(loadItems).toHaveBeenCalled();
  });
});
