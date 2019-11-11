import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import { renderShallow, createMockNavState } from '../../../../testUtils';
import { celebrationItemSelector } from '../../../selectors/celebration';
import { organizationSelector } from '../../../selectors/organizations';
import * as common from '../../../utils/common';
import {
  reloadCelebrateComments,
  resetCelebrateEditingComment,
} from '../../../actions/celebrateComments';
import { celebrateCommentsSelector } from '../../../selectors/celebrateComments';

import CelebrateDetailScreen from '..';

jest.mock('../../../selectors/celebration');
jest.mock('../../../selectors/celebrateComments');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/celebrateComments');
jest.useFakeTimers();

reloadCelebrateComments.mockReturnValue({ type: 'reloadCelebrateComments' });
resetCelebrateEditingComment.mockReturnValue({
  type: 'resetCelebrateEditingComment',
});
MockDate.set('2019-04-12 12:00:00', 300);

const mockStore = configureStore([thunk]);
let store;

const celebrateComments = {
  comments: [
    {
      id: 'comment1',
      person: { first_name: 'Person', last_name: '1' },
      content: 'some comment',
      created_at: '2019-04-11T13:51:49.888',
    },
    {
      id: 'comment2',
      person: { first_name: 'Person', last_name: '2' },
      content: 'some comment',
      created_at: '2019-04-11T13:51:49.888',
    },
  ],
  pagination: {},
};

const organization = { id: '24234234' };
const event = {
  id: '90001',
  organization,
  subject_person_name: 'Roger',
  changed_attribute_value: '2019-04-11T13:51:49.888',
};
const organizations = [organization];
const myId = 'myId';

let screen;
let instance;
const listRef = { scrollToEnd: jest.fn(), scrollToIndex: jest.fn() };

celebrationItemSelector.mockReturnValue(event);
organizationSelector.mockReturnValue(organization);
celebrateCommentsSelector.mockReturnValue(celebrateComments),
  beforeEach(() => {
    store = mockStore({
      organizations,
      celebrateComments: { editingCommentId: null },
      auth: { person: { id: myId } },
    });

    screen = renderShallow(
      <CelebrateDetailScreen navigation={createMockNavState({ event })} />,
      store,
    );
    instance = screen.instance();
    instance.listRef = listRef;
  });

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

it('should call celebrationItemSelector', () => {
  expect(celebrationItemSelector).toHaveBeenCalledWith(
    { organizations },
    { eventId: event.id, organizationId: organization.id },
  );
});

it('should call organizationSelector', () => {
  expect(organizationSelector).toHaveBeenCalledWith(
    { organizations },
    { orgId: organization.id },
  );
});

describe('refresh', () => {
  it('calls refreshComments', () => {
    screen.instance().refreshComments();
    expect(reloadCelebrateComments).toHaveBeenCalledWith(event);
  });
  it('calls handleRefresh', () => {
    common.refresh = jest.fn();
    screen
      .childAt(1)
      .childAt(2)
      .props()
      .listProps.refreshControl.props.onRefresh();
    expect(common.refresh).toHaveBeenCalledWith(
      screen.instance(),
      screen.instance().refreshComments,
    );
  });
});

describe('celebrate add complete', () => {
  it('scrolls to end on add complete', () => {
    screen
      .childAt(2)
      .props()
      .onAddComplete();
    expect(listRef.scrollToEnd).toHaveBeenCalled();
  });
});

it('componentWillUnmount', () => {
  const instance = screen.instance();
  const remove = jest.fn();
  instance.keyboardShowListener = { remove };
  instance.componentWillUnmount();

  expect(remove).toHaveBeenCalled();
});

describe('keyboard show', () => {
  it('without editing comment', () => {
    screen.instance().keyboardShow();
    expect(listRef.scrollToEnd).toHaveBeenCalled();
  });
  it('with editing comment', () => {
    screen.setProps({ editingCommentId: celebrateComments.comments[0].id });
    screen.instance().keyboardShow();
    expect(listRef.scrollToIndex).toHaveBeenCalledWith({
      index: 0,
      viewPosition: 1,
    });
  });
  it('with editing comment that doesnt exist', () => {
    screen.setProps({ editingCommentId: 'doesnt exist' });
    screen.instance().keyboardShow();
    expect(listRef.scrollToEnd).toHaveBeenCalled();
  });
});
