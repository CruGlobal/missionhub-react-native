import { ScrollView } from 'react-native';
import React from 'react';
import i18next from 'i18next';

import { renderShallow } from '../../testUtils';
import { StepsScreen, mapStateToProps } from '../../src/containers/StepsScreen';
import {
  reminderStepsSelector,
  nonReminderStepsSelector,
} from '../../src/selectors/steps';
import theme from '../../src/theme';
import { trackActionWithoutData } from '../../src/actions/analytics';
import { ACTIONS } from '../../src/constants';
import {
  showReminderScreen,
  showWelcomeNotification,
  toast,
} from '../../src/actions/notifications';
import {
  completeStepReminder,
  deleteStepWithTracking,
  setStepFocus,
} from '../../src/actions/steps';

jest.mock('../../src/selectors/steps');
jest.mock('../../src/actions/analytics');
jest.mock('../../src/actions/notifications');
jest.mock('../../src/actions/steps');

const dispatch = jest.fn(async () => {});

const store = {
  steps: {
    mine: true,
    pagination: {
      hasNextPage: true,
    },
  },
  people: {},
  notifications: {
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
  dispatch,
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
  dispatch,
};

describe('StepsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      reminderStepsSelector.mockReturnValue([{ id: 1, reminder: true }]);
      nonReminderStepsSelector.mockReturnValue([{ id: 2 }, { id: 3 }]);
      expect(mapStateToProps(store)).toMatchSnapshot();
    });
  });

  const createComponent = props => renderShallow(<StepsScreen {...props} />);

  const stopLoad = component => {
    component.instance().setState({ loading: false });
    component.update();
    return component;
  };

  it('renders loading screen correctly', () => {
    let component = createComponent({ ...propsWithoutSteps, steps: null });

    expect(component).toMatchSnapshot();
  });

  it('renders empty screen correctly', () => {
    let component = createComponent(propsWithoutSteps);
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  });

  it('renders screen with steps correctly', () => {
    let component = createComponent(propsWithSteps);
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with max reminders', () => {
    const reminders = [
      { id: 11, reminder: true },
      { id: 12, reminder: true },
      { id: 13, reminder: true },
    ];

    let component = createComponent({ ...propsWithSteps, reminders });
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  });

  describe('Background color changes with scrolling', () => {
    let component;

    beforeEach(() => {
      component = createComponent(propsWithSteps);
      component = stopLoad(component);
    });

    const getBackgroundColor = componentParam => {
      return componentParam
        .find(ScrollView)
        .props()
        .style.find(element => {
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

    it('should not run handle next', () => {
      component.setState({ paging: true });
      component.instance().handleNextPage();

      expect(component.state('paging')).toBe(true);
    });
  });

  describe('handleSetReminder', () => {
    it('should focus a step', () => {
      const component = createComponent({
        ...propsWithSteps,
        reminders: [],
      });

      component.instance().handleSetReminder('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(toast).toHaveBeenCalledWith('✔ Reminder Added');
      expect(setStepFocus).toHaveBeenCalledWith('testStep', true);
      expect(showReminderScreen).toHaveBeenCalledWith(
        i18next.t('notificationPrimer:focusDescription'),
      );
      expect(showWelcomeNotification).toHaveBeenCalled();
    });

    it('should focus a step and not show notification reminder screen if reminders already exist', () => {
      const component = createComponent({
        ...propsWithSteps,
        reminders: ['someStep'],
      });

      component.instance().handleSetReminder('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(toast).toHaveBeenCalledWith('✔ Reminder Added');
      expect(setStepFocus).toHaveBeenCalledWith('testStep', true);
      expect(showReminderScreen).not.toHaveBeenCalled();
      expect(showWelcomeNotification).toHaveBeenCalled();
    });

    it('should not focus a step when reminders slots are filled', () => {
      const component = createComponent({
        ...propsWithSteps,
        reminders: ['step1', 'step2', 'step3'],
      });

      component.instance().handleSetReminder('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(toast).not.toHaveBeenCalled();
      expect(setStepFocus).not.toHaveBeenCalled();
      expect(showReminderScreen).not.toHaveBeenCalled();
      expect(showWelcomeNotification).not.toHaveBeenCalled();
    });
  });

  describe('handleRemoveReminder', () => {
    it('should remove reminder', () => {
      const step = 'some step';
      const component = createComponent({
        ...propsWithSteps,
        reminders: [step],
      });

      component.instance().handleRemoveReminder(step);

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_DEPRIORITIZED,
      );
      expect(setStepFocus).toHaveBeenCalledWith(step, false);
    });
  });

  describe('completing a step', () => {
    it('should complete the step', () => {
      const step = 'some step';
      const component = createComponent({
        ...propsWithSteps,
        reminders: [step],
      });

      component.instance().handleCompleteReminder(step);

      expect(completeStepReminder).toHaveBeenCalledWith(step, 'Steps');
    });
  });

  describe('deleting a step', () => {
    it('should delete the step', () => {
      const step = 'some step';
      const component = createComponent({
        ...propsWithSteps,
        reminders: [step],
      });

      component.instance().handleDeleteReminder(step);

      expect(deleteStepWithTracking).toHaveBeenCalledWith(step, 'Steps');
    });
  });
});
