import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import * as navigation from '../../src/actions/navigation';
import * as interactions from '../../src/actions/interactions';
import { createMockNavState, testSnapshot } from '../../testUtils';
import { ContactActions } from '../../src/containers/ContactActions';

const personId = '123';

const mockPerson = {
  id: personId,
  first_name: 'ben',
  organizational_permissions: [{ organization_id: 2 }],
};
it('renders dummy view', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactActions />
    </Provider>,
  );
});

let store;
beforeEach(() => (store = configureStore([thunk])()));

describe('action methods', () => {
  let component;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <ContactActions
        person={mockPerson}
        navigation={createMockNavState()}
        dispatch={jest.fn()}
      />,
      { context: { store } },
    );

    component = screen
      .dive()
      .dive()
      .instance();
  });

  // it('renders a journey row', () => {
  //
  //   const snap = component.renderIcons({ item: {
  //     id: '123',
  //     iconName: 'commentIcon',
  //   } });
  //   expect(snap).toMatchSnapshot();
  // });

  it('handles create interaction', () => {
    const comment = 'test';
    navigation.navigatePush = jest.fn();
    component.handleCreateInteraction(
      { id: 1, iconName: 'commentIcon' },
      comment,
    );
    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

  it('handles add interaction', () => {
    const comment = 'test';
    interactions.addNewInteraction = jest.fn();
    component.handleInteraction({ id: 1, iconName: 'commentIcon' }, comment);
    expect(interactions.addNewInteraction).toHaveBeenCalledTimes(1);
  });
});
