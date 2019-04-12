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
  return screen.childAt(1).props();
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

it('onLayout', () => {
  const height = 1000;
  parallaxScrollView().onLayout({ nativeEvent: { layout: { height } } });
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
  let instance;
  const scrollResponder = {
    scrollToEnd: jest.fn(),
    scrollTo: jest.fn(),
  };
  const height = 1000;
  const scrollViewHeight = 750;
  function setInstance(pageY, noRef = false) {
    const ref = {
      getWrappedInstance: () => ({
        view: { measure: cb => cb(0, 0, 0, height, 0, pageY) },
      }),
    };
    const refs = noRef
      ? {}
      : {
          [celebrateComments.comments[0].id]: ref,
          [celebrateComments.comments[1].id]: ref,
        };
    instance = screen.instance();
    screen.setState({ scrollViewHeight });
    screen.update();
    instance.getCommentRefs = jest.fn().mockReturnValue(refs);
    instance.list = { getScrollResponder: () => scrollResponder };
  }
  function checkShow(method) {
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1);
    jest.runAllTimers();
    expect(method || scrollResponder.scrollTo).toHaveBeenCalled();
  }
  function checkKeyboardShow(pageY, noRef, method) {
    setInstance(pageY, noRef);
    instance.keyboardShow();
    checkShow(method);
  }
  it('keyboard shows without any comments to focus', () => {
    setInstance(500, true);
    instance.keyboardShow();
    expect(setTimeout).not.toHaveBeenCalled();
    expect(scrollResponder.scrollTo).not.toHaveBeenCalled();
  });
  it('keyboard shows and scrolls to component', () => {
    checkKeyboardShow(500);
  });
  it('keyboard shows and scrolls to end', () => {
    checkKeyboardShow(2500, undefined, scrollResponder.scrollToEnd);
  });
  it('keyboard shows and scrolls to editing comment', () => {
    screen.setProps({ editingCommentId: celebrateComments.comments[0].id });
    checkKeyboardShow(500);
  });
  it('add comment scroll to latest', () => {
    setInstance(500);
    screen
      .childAt(2)
      .props()
      .onAddComplete();
    checkShow();
  });
});
