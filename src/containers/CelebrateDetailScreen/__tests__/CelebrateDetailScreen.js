import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import MockDate from 'mockdate';

import CelebrateDetailScreen from '..';

import { renderShallow, createMockNavState } from '../../../../testUtils';
import { celebrationItemSelector } from '../../../selectors/celebration';
import { organizationSelector } from '../../../selectors/organizations';
import * as common from '../../../utils/common';
import {
  reloadCelebrateComments,
  resetCelebrateEditingComment,
} from '../../../actions/celebrateComments';
import { celebrateCommentsSelector } from '../../../selectors/celebrateComments';

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
      <CelebrateDetailScreen
        navigation={{
          state: {
            params: { event },
          },
        }}
      />,
      store,
    );
  });

// Want to validate that the full tree does not change since it relies on refs in child components
describe('CelebrateDetailScreen', () => {
  let tree;

  beforeEach(() => {
    tree = renderer.create(
      <Provider store={store}>
        <CelebrateDetailScreen
          navigation={createMockNavState({
            event,
          })}
        />
      </Provider>,
    );
  });

  it('renders tree correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('renderForeground', () => {
  it('renders correctly', () => {
    expect(parallaxScrollView().renderForeground()).toMatchSnapshot();
  });
});

describe('renderStickyHeader', () => {
  it('renders correctly', () => {
    expect(parallaxScrollView().renderStickyHeader()).toMatchSnapshot();
  });
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

function parallaxScrollView() {
  return screen
    .childAt(1)
    .childAt(0)
    .props();
}

describe('refresh', () => {
  it('calls refreshComments', () => {
    screen.instance().refreshComments();
    expect(reloadCelebrateComments).toHaveBeenCalledWith(event);
  });
  it('calls handleRefresh', () => {
    common.refresh = jest.fn();
    parallaxScrollView().refreshControl.props.onRefresh();
    expect(common.refresh).toHaveBeenCalledWith(
      screen.instance(),
      screen.instance().refreshComments,
    );
  });
});

it('onContentSizeChange', () => {
  const height = 1000;
  parallaxScrollView().onContentSizeChange(0, height);
  screen.update();
  expect(screen.instance().state.scrollViewHeight).toEqual(height);
});

it('componentWillUnmount', () => {
  const instance = screen.instance();
  const remove = jest.fn();
  instance.keyboardShowListener = { remove };
  instance.componentWillUnmount();

  expect(remove).toHaveBeenCalled();
});

describe('scroll events', () => {
  const setManyComments = () =>
    screen.setProps({
      celebrateComments: {
        comments: [
          // Mock out lots of comments
          celebrateComments.comments[0],
          celebrateComments.comments[0],
          celebrateComments.comments[0],
          celebrateComments.comments[0],
          celebrateComments.comments[1],
        ],
      },
    });
  let instance;
  const scrollResponder = {
    scrollToEnd: jest.fn(),
    scrollTo: jest.fn(),
    getInnerViewNode: jest.fn(),
  };
  const height = 1000;
  const scrollViewHeight = 750;
  const y = 500;
  const getRef = error => ({
    getWrappedInstance: () => ({
      view: { measureLayout: (a, b, c) => (error ? c() : b(0, y, 0, height)) },
    }),
  });
  function setInstance(paramRefs) {
    const refs = paramRefs || {
      [celebrateComments.comments[0].id]: getRef(),
      [celebrateComments.comments[1].id]: getRef(),
    };
    instance = screen.instance();
    screen.setState({ scrollViewHeight });
    screen.update();
    instance.commentListRefs = refs;
    instance.list = { getScrollResponder: () => scrollResponder };
  }
  function checkShow(method) {
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1);
    jest.runAllTimers();
    expect(method || scrollResponder.scrollTo).toHaveBeenCalled();
  }
  function checkKeyboardShow(paramRefs, method) {
    setInstance(paramRefs);
    instance.keyboardShow();
    checkShow(method);
  }
  it('keyboard shows without any comments to focus', () => {
    checkKeyboardShow({});
  });
  it('keyboard shows and scrolls to component', () => {
    checkKeyboardShow();
  });
  it('keyboard shows for edit error measuring ref', () => {
    screen.setProps({ editingCommentId: celebrateComments.comments[0].id });
    checkKeyboardShow(
      { [celebrateComments.comments[0].id]: getRef(true) },
      scrollResponder.scrollToEnd,
    );
  });
  it('keyboard shows and scrolls to editing comment', () => {
    screen.setProps({ editingCommentId: celebrateComments.comments[0].id });
    checkKeyboardShow();
  });
  it('keyboard shows scroll to end with many comments', () => {
    setManyComments();
    checkKeyboardShow(undefined, scrollResponder.scrollToEnd);
  });
  it('keyboard shows editing comment scroll to end with many comments', () => {
    setManyComments();
    screen.setProps({ editingCommentId: celebrateComments.comments[1].id });
    checkKeyboardShow(undefined, scrollResponder.scrollToEnd);
  });
  it('add comment scroll to latest', () => {
    setInstance();
    screen
      .childAt(2)
      .props()
      .onAddComplete();
    checkShow();
  });
});
