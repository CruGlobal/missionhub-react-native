import { ScrollView } from 'react-native';
import React from 'react';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

import { StepsScreen, mapStateToProps } from '../../src/containers/StepsScreen';
import { reminderStepsSelector, nonReminderStepsSelector } from '../../src/selectors/steps';
jest.mock('../../src/selectors/steps');
import theme from '../../src/theme';

const props = {
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

describe('StepsScreen', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      reminderStepsSelector.mockReturnValue([ { id: 1, reminder: true } ]);
      nonReminderStepsSelector.mockReturnValue([ { id: 2 }, { id: 3 } ]);
      expect(mapStateToProps(
        {
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
        },
      )).toMatchSnapshot();
    });
  });

  it('renders correctly', () => {
    testSnapshotShallow(
      <StepsScreen
        {...props}
      />
    );
  });

  describe('Background color changes with scrolling', () => {
    const createComponent = () => {
      return renderShallow(
        <StepsScreen {...props} />,
      );
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
      let component = createComponent();
      component.instance().handleNextPage();

      expect(component.state('paging')).toBe(false);
    });

    it('does not runs handle next', () => {
      let component = createComponent();
      component.setState({ paging: true });
      component.instance().handleNextPage();

      expect(component.state('paging')).toBe(true);
    });

  });
});

