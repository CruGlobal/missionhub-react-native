import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import ContactSteps from '../../src/containers/ContactSteps';
import { Provider } from 'react-redux';
import { createMockStore, createMockNavState, testSnapshot } from '../../testUtils';
import Adapter from 'enzyme-adapter-react-16/build/index';
import * as navigation from '../../src/actions/navigation';

const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactSteps person={{ first_name: 'ben', id: 1 }} navigation={createMockNavState()} />
    </Provider>
  );
});


it('navigates to my steps', () => {
  let component;
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <ContactSteps
      isMe={true}
      person={{ first_name: 'ben', id: 1 }}
      navigation={createMockNavState()}
    />,
    { context: { store } },
  );
  component = screen.dive().instance();

  navigation.navigatePush = jest.fn();
  component.handleCreateStep();
  expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
});


it('navigates to person steps', () => {
  let component;
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <ContactSteps
      isMe={false}
      person={{ first_name: 'ben', id: 1 }}
      navigation={createMockNavState()}
    />,
    { context: { store } },
  );
  component = screen.dive().dive().dive().instance();

  navigation.navigatePush = jest.fn();
  component.handleCreateStep();
  expect(navigation.navigatePush).toHaveBeenCalledTimes(0);
});

