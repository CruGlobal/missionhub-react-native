import { ScrollView } from 'react-native';
import React from 'react';
import { renderShallow } from '../../testUtils';

import { StepsScreen, mapStateToProps } from '../../src/containers/StepsScreen';
import { reminderStepsSelector, nonReminderStepsSelector } from '../../src/selectors/steps';
jest.mock('../../src/selectors/steps');
import theme from '../../src/theme';
import Enzyme from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';

const store = {
  steps: {
    pagination: {
      hasNextPage: true,
    },
  },
  people: {},
  notifications: {
    hasAsked: false,
    shouldAsk: false,
    token: '',
    showReminder: true,
  },
  swipe: {
    stepsHome: true,
    stepsReminder: true,
  },
};

const propsWithSteps = {
  areNotificationsOff: true,
  hasMoreSteps: true,
  reminders: [
    {
      id: 1,
      reminder: true,
    },
  ],
  showNotificationReminder: true,
  showStepBump: true,
  showStepReminderBump: true,
  steps: [
    {
      id: 2,
    },
    {
      id: 3,
    },
  ],
  dispatch: jest.fn(() => Promise.resolve()),
};

const propsWithoutSteps = {
  areNotificationsOff: true,
  hasMoreSteps: true,
  reminders: [
    {
      id: 1,
      reminder: true,
    },
  ],
  showNotificationReminder: true,
  showStepBump: true,
  showStepReminderBump: true,
  steps: [],
  dispatch: jest.fn(() => Promise.resolve()),
};

describe('StepsScreen', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      reminderStepsSelector.mockReturnValue([ { id: 1, reminder: true } ]);
      nonReminderStepsSelector.mockReturnValue([ { id: 2 }, { id: 3 } ]);
      expect(mapStateToProps(store)).toMatchSnapshot();
    });
  });


  describe('renders correctly', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const createComponent = (props) => {
      const screen = renderShallow(
        <StepsScreen {...props} />,
      );
      return screen;
    };

    it('renders loading screen correctly', () => {
      let component = createComponent(propsWithSteps);

      expect(component).toMatchSnapshot();
    });

    it('renders empty screen correctly', () => {
      let component = createComponent(propsWithoutSteps);
      component.instance().setState({ loading: false });
      component.update();
      expect(component).toMatchSnapshot();
    });

    it('renders screen with steps correctly', () => {
      let component = createComponent(propsWithSteps);
      component.instance().setState({ loading: false });
      component.update();
      expect(component).toMatchSnapshot();
    });
  });


  describe('Background color changes with scrolling', () => {
    let component;

    beforeEach(() => {
      component = renderShallow(<StepsScreen {...propsWithSteps} />);
      component.instance().setState({ loading: false });
      component.update();
    });

    const getBackgroundColor = (component) => {
      return component.find(ScrollView).props().style.find((element) => {
        return element.backgroundColor;
      }).backgroundColor;
    };


    it('Starts with white background', () => {
      expect(getBackgroundColor(component)).toBe(theme.white);
    });

    it('Background is blue when overscrolling up', () => {
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
      component.instance().handleScroll({
        nativeEvent: {
          contentOffset: { y: -1 },
          layoutMeasurement: { height: 200 },
          contentSize: { height: 400 },
        },
      });
      component.update();
      component.instance().handleScroll({
        nativeEvent: {
          contentOffset: { y: 1 },
          layoutMeasurement: { height: 200 },
          contentSize: { height: 400 },
        },
      });
      component.update();
      expect(getBackgroundColor(component)).toBe(theme.white);
    });

    it('runs handle next', () => {
      component.instance().handleNextPage();

      expect(component.state('paging')).toBe(false);
    });

    it('does not runs handle next', () => {
      component.setState({ paging: true });
      component.instance().handleNextPage();

      expect(component.state('paging')).toBe(true);
    });

  });
});

