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
      created_at: '2019-04-12 00:00:00 UTC',
    },
    {
      id: 'comment2',
      person: { first_name: 'Person', last_name: '2' },
      content: 'some comment',
      created_at: '2019-04-12 00:00:00 UTC',
    },
  ],
  pagination: {},
};

const organization = { id: '24234234' };
const event = {
  id: '90001',
  organization,
  subject_person_name: 'Roger',
  changed_attribute_value: '2019-04-12 00:00:00 UTC',
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

describe('scroll events', () => {
  const scrollResponder = {
    scrollToEnd: jest.fn(),
    scrollTo: jest.fn(),
  };
  function setInstance(pageY, noRef = false) {
    const height = 1000;
    const scrollViewHeight = 750;
    const refs = noRef
      ? {}
      : {
          [celebrateComments.comments[1].id]: {
            getWrappedInstance: () => ({
              view: { measure: cb => cb(0, 0, 0, height, 0, pageY) },
            }),
          },
        };
    instance = screen.instance();
    screen.setState({ scrollViewHeight });
    screen.update();
    instance.commentsList = {
      getWrappedInstance: () => ({
        getWrappedInstance: () => ({ getItemRefs: () => refs }),
      }),
    };
    instance.list = { getScrollResponder: () => scrollResponder };
  }
  function checkTimeout() {
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1);
    jest.runAllTimers();
  }
  let instance;
  it('keyboard shows without any comments to focus', () => {
    setInstance(500, true);
    instance.keyboardShow();
    expect(setTimeout).not.toHaveBeenCalled();
    expect(scrollResponder.scrollTo).toHaveBeenCalled();
  });
  it('keyboard shows and scrolls to component', () => {
    setInstance(500);
    instance.keyboardShow();
    checkTimeout();
    expect(scrollResponder.scrollTo).toHaveBeenCalled();
  });
  it('keyboard shows and scrolls to end', () => {
    setInstance(2500);
    instance.keyboardShow();
    checkTimeout();
    expect(scrollResponder.scrollToEnd).toHaveBeenCalled();
  });
  it('keyboard shows and scrolls to editing comment', () => {
    screen.setProps({ editingCommentId: celebrateComments.comments[0].id });
    setInstance(500);
    instance.keyboardShow();
    checkTimeout();
    expect(scrollResponder.scrollTo).toHaveBeenCalled();
  });
  it('add comment scroll to latest', () => {
    setInstance(500);
    screen
      .childAt(2)
      .props()
      .onAddComplete();
    checkTimeout();
    expect(scrollResponder.scrollTo).toHaveBeenCalled();
  });
});
