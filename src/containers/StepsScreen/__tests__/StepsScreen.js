/* eslint max-lines: 0, max-lines-per-function: 0 */

import { ScrollView } from 'react-native';
import React from 'react';
import i18next from 'i18next';

import { renderShallow } from '../../../../testUtils';

import { StepsScreen, mapStateToProps } from '..';

import {
  reminderStepsSelector,
  nonReminderStepsSelector,
} from '../../../selectors/steps';
import theme from '../../../theme';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';
import {
  showReminderScreen,
  showWelcomeNotification,
} from '../../../actions/notifications';
import {
  completeStepReminder,
  deleteStepWithTracking,
  setStepFocus,
} from '../../../actions/steps';
import * as common from '../../../utils/common';
import { navToPersonScreen } from '../../../actions/person';

jest.mock('../../../selectors/steps');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/person');

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

const reminders = [
  {
    id: 0,
    reminder: true,
  },
  {
    id: 1,
    reminder: true,
  },
  {
    id: 2,
    reminder: true,
  },
];

const steps = [
  {
    id: 0,
    receiver: { id: '00' },
    organization: { id: '000' },
  },
  {
    id: 1,
    receiver: { id: '11' },
    organization: { id: '111' },
  },
  {
    id: 2,
    receiver: { id: '22' },
    organization: { id: '222' },
  },
  {
    id: 3,
    receiver: { id: '33' },
    organization: { id: '333' },
  },
];

const baseProps = {
  areNotificationsOff: true,
  hasMoreSteps: true,
  showNotificationReminder: true,
  showStepBump: true,
  showStepReminderBump: true,
  dispatch,
  reminders,
  steps,
};

common.toast = jest.fn();

describe('StepsScreen', () => {
  let component;
  let props;

  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      reminderStepsSelector.mockReturnValue([{ id: 1, reminder: true }]);
      nonReminderStepsSelector.mockReturnValue([{ id: 2 }, { id: 3 }]);
      expect(mapStateToProps(store)).toMatchSnapshot();
    });
  });

  const createComponent = componentProps =>
    renderShallow(<StepsScreen {...componentProps} />);

  const stopLoad = component => {
    component.instance().setState({ loading: false });
    component.update();
    return component;
  };

  const testRender = () => {
    component = createComponent(props);
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  };

  it('renders loading screen correctly', () => {
    props = {
      ...baseProps,
      reminders: [],
      steps: null,
    };

    component = createComponent(props);

    expect(component).toMatchSnapshot();
  });

  it('renders empty screen with one reminder correctly', () => {
    props = {
      ...baseProps,
      reminders: reminders.slice(0, 1),
      steps: [],
    };
    testRender();
  });

  it('renders with no steps (focused or unfocused) correctly', () => {
    props = {
      ...baseProps,
      reminders: [],
      steps: [],
    };
    testRender();
  });

  it('renders with no focused steps correctly', () => {
    props = {
      ...baseProps,
      reminders: [],
      steps,
    };
    testRender();
  });

  it('renders with no focused steps and less than 4 unfocused steps correctly', () => {
    props = {
      ...baseProps,
      reminders: [],
      steps: steps.slice(0, 3),
    };
    testRender();
  });

  it('renders screen with some focused and unfocused steps correctly', () => {
    props = {
      ...baseProps,
      reminders: reminders.slice(0, 1),
      steps: steps,
    };
    testRender();
  });

  it('renders with max reminders correctly', () => {
    props = {
      ...baseProps,
      reminders,
      steps,
    };
    testRender();
  });

  describe('Background color changes with scrolling', () => {
    beforeEach(() => {
      component = createComponent(baseProps);
      component = stopLoad(component);
    });

    const getBackgroundColor = component => {
      return component
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
        ...baseProps,
        reminders: [],
      });

      component.instance().handleSetReminder('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(common.toast).toHaveBeenCalledWith('✔ Reminder Added');
      expect(setStepFocus).toHaveBeenCalledWith('testStep', true);
      expect(showReminderScreen).toHaveBeenCalledWith(
        i18next.t('notificationPrimer:focusDescription'),
      );
      expect(showWelcomeNotification).toHaveBeenCalled();
    });

    it('should focus a step and not show notification reminder screen if reminders already exist', () => {
      const component = createComponent({
        ...baseProps,
        reminders: ['someStep'],
      });

      component.instance().handleSetReminder('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(common.toast).toHaveBeenCalledWith('✔ Reminder Added');
      expect(setStepFocus).toHaveBeenCalledWith('testStep', true);
      expect(showReminderScreen).not.toHaveBeenCalled();
      expect(showWelcomeNotification).toHaveBeenCalled();
    });

    it('should not focus a step when reminders slots are filled', () => {
      const component = createComponent({
        ...baseProps,
        reminders: ['step1', 'step2', 'step3'],
      });

      component.instance().handleSetReminder('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(common.toast).not.toHaveBeenCalled();
      expect(setStepFocus).not.toHaveBeenCalled();
      expect(showReminderScreen).not.toHaveBeenCalled();
      expect(showWelcomeNotification).not.toHaveBeenCalled();
    });
  });

  describe('handleRemoveReminder', () => {
    it('should remove reminder', () => {
      const step = 'some step';
      const component = createComponent({
        ...baseProps,
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
        ...baseProps,
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
        ...baseProps,
        reminders: [step],
      });

      component.instance().handleDeleteReminder(step);

      expect(deleteStepWithTracking).toHaveBeenCalledWith(step, 'Steps');
    });
  });

  describe('arrow functions', () => {
    it('should render item correctly', () => {
      const component = createComponent(baseProps);

      const renderedItem = component
        .instance()
        .renderItem({ item: baseProps.steps[0], index: 0 });
      expect(renderedItem).toMatchSnapshot();
    });
    it('should list ref', () => {
      const instance = createComponent(baseProps).instance();
      const ref = 'test';
      instance.listRef(ref);
      expect(instance.list).toEqual(ref);
    });
    it('should list key extractor', () => {
      const instance = createComponent(baseProps).instance();
      const item = { id: '1' };
      const result = instance.listKeyExtractor(item);
      expect(result).toEqual(item.id);
    });
    it('should open main menu', () => {
      const instance = createComponent(baseProps).instance();
      common.openMainMenu = jest.fn();
      instance.openMainMenu();
      expect(common.openMainMenu).toHaveBeenCalled();
    });
  });

  describe('handleRowSelect', () => {
    it('should navigate to person screen', () => {
      const step = baseProps.steps[0];
      const { receiver, organization } = step;
      const screen = createComponent(baseProps);
      const listItem = renderShallow(
        screen
          .childAt(1)
          .childAt(0)
          .childAt(1)
          .props()
          .renderItem({ item: step }),
      )
        .childAt(1)
        .childAt(0);

      listItem.props().onSelect(step);

      expect(navToPersonScreen).toHaveBeenCalledWith(receiver, organization);
    });
  });
});
