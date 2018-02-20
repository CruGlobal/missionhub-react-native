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
    pagination: {
      hasNextPage: false,
    },
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

  const createComponent = () => {
    const screen = shallow(
      <StepsScreen />,
      { context: { store } },
    );
    return screen.dive().dive().dive();
  };

  const getBackgroundColor = (component) => {
    return component.find(ScrollView).props().style.find((element) => {
      return element.backgroundColor;
    }).backgroundColor;
  };


  it('Starts with white background', () => {
    let component = createComponent();
    expect(getBackgroundColor(component)).toBe(theme.white);
  });

  it('Background is blue when overscrolling up', () => {
    let component = createComponent();
    component.instance().handleScroll({
      nativeEvent: {
        contentOffset: { y: -1 },
        layoutMeasurement: { height: 200 },
        contentSize: { height: 400 },
      },
    });
    component.update();
    expect(getBackgroundColor(component)).toBe(theme.backgroundColor);
  });

  it('Background is white when scrolling back down', () => {
    let component = createComponent();
    component.instance().handleScroll({ nativeEvent: { contentOffset: { y: -1 } } });
    component.update();
    component.instance().handleScroll({ nativeEvent: { contentOffset: { y: 1 } } });
    component.update();
    expect(getBackgroundColor(component)).toBe(theme.white);
  });

});

