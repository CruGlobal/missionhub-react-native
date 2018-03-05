import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Note: test renderer must be required after react-native.

import * as navigation from '../../src/actions/navigation';
import ContactJourney from '../../src/containers/ContactJourney';
import { Provider } from 'react-redux';
import { createMockNavState, testSnapshot } from '../../testUtils';

Enzyme.configure({ adapter: new Adapter() });

const personId = '123';
const mockState = {
  auth: {
    person: personId,
    isJean: true,
  },
  swipe: {
    journey: false,
  },
};

const mockPerson = {
  id: personId,
  first_name: 'ben',
  organizational_permissions: [
    { organization_id: 2 },
  ],
};

let store;
beforeEach(() => store = configureStore([ thunk ])(mockState));

const mockAddComment = jest.fn(() => Promise.resolve());
const mockEditComment = jest.fn(() => Promise.resolve());
jest.mock('react-native-device-info');
jest.mock('../../src/actions/interactions', () => ({
  addNewInteraction: () => mockAddComment,
  editComment: () => mockEditComment,
}));


it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactJourney person={mockPerson} navigation={createMockNavState()} />
    </Provider>
  );
});


describe('journey methods', () => {
  let component;
  beforeEach(() => {

    const screen = shallow(
      <ContactJourney person={mockPerson} navigation={createMockNavState()} />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('renders a journey row', () => {
    const snap = component.renderRow({ item: {
      id: '123',
      text: '123',
    } });
    expect(snap).toMatchSnapshot();
  });

  it('renders a survey row', () => {
    const snap = component.renderRow({ item: {
      id: '124',
      text: '124',
      type: 'survey',
    } });
    expect(snap).toMatchSnapshot();
  });

  it('renders a survey row', () => {
    const snap = component.renderRow({ item: {
      id: '124',
      text: '124',
      type: 'stage',
    } });
    expect(snap).toMatchSnapshot();
  });

  it('handles add comment', () => {
    const comment = 'test';
    component.handleAddComment(comment);
    expect(mockAddComment).toHaveBeenCalledTimes(1);
  });

  it('handles edit comment', () => {
    const comment = 'test';
    component.handleEditInteraction({ text: comment });

    component.handleEditComment(comment);

    expect(mockEditComment).toHaveBeenCalledTimes(1);
  });

  it('handles edit interaction', () => {
    navigation.navigatePush = jest.fn((screen) => ({ type: screen }));
    component.handleEditInteraction({ id: 1 });

    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });
});

it('renders with an organization correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactJourney person={mockPerson} organization={{ id: 1 }} navigation={createMockNavState()} />
    </Provider>
  );
});
