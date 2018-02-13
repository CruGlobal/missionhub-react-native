import { ScrollView } from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import StepsScreen from '../../src/containers/StepsScreen';
import { testSnapshot } from '../../testUtils';
import theme from '../../src/theme';
import Adapter from 'enzyme-adapter-react-16/build/index';

const mockState = {
  auth: {
    personId: '',
    isJean: false,
  },
  steps: {
    mine: [],
    suggestedForMe: [],
    suggestedForOthers: [],
    reminders: [],
  },
  notifications: {
    token: '',
    hasAsked: false,
    shouldAsk: true,
    showReminder: true,
  },
  swipe: {
    stepsHome: true,
    stepsReminder: true,
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly as Casey', () => {
  testSnapshot(
    <Provider store={store}>
      <StepsScreen />
    </Provider>
  );
});

it('renders correctly as Jean', () => {
  store.getState().auth.isJean = true;

  testSnapshot(
    <Provider store={store}>
      <StepsScreen />
    </Provider>
  );
});


describe('Background color changes with scrolling', () => {
  Enzyme.configure({ adapter: new Adapter() });

  const screen = shallow(
    <StepsScreen />,
    { context: { store } },
  );

  let component = screen.dive().dive().dive();

  it('Background is white', () => {
    const color = component.find(ScrollView).props().styles.find('backgroundColor');

    expect(color).toBe(theme.white);
  });
});

