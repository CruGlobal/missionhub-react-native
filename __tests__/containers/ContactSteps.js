import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import ContactSteps from '../../src/containers/ContactSteps';
import { Provider } from 'react-redux';
import { createMockStore, createMockNavState, testSnapshot } from '../../testUtils';
import Adapter from 'enzyme-adapter-react-16/build/index';
import * as navigation from '../../src/actions/navigation';
import { SELECT_MY_STEP_SCREEN } from '../../src/containers/SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../src/containers/PersonSelectStepScreen';

const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
  auth: {},
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


let component;
Enzyme.configure({ adapter: new Adapter() });

const testNavigation = (isCurrentUser, nextScreen) => {
  const screen = shallow(
    <ContactSteps
      isMe={isCurrentUser}
      person={{ first_name: 'ben', id: 1 }}
      navigation={createMockNavState()}
    />,
    { context: { store } },
  );
  component = screen.dive().dive().dive().instance();

  navigation.navigatePush = jest.fn();
  component.handleCreateStep();
  expect(navigation.navigatePush).toHaveBeenCalledWith(nextScreen, expect.anything());
};

it('navigates to my steps', testNavigation(true, SELECT_MY_STEP_SCREEN));


it('navigates to person steps', testNavigation(false, PERSON_SELECT_STEP_SCREEN));



