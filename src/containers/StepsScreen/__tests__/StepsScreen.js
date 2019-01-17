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
      receiver: { id: '22' },
      organization: { id: '222' },
    },
    {
      id: 3,
      receiver: { id: '33' },
      organization: { id: '333' },
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

common.toast = jest.fn();

describe('StepsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let component;

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
    component = createComponent({ ...propsWithoutSteps, steps: null });

    expect(component).toMatchSnapshot();
  });

  it('renders empty screen correctly', () => {
    component = createComponent(propsWithoutSteps);
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  });

  it('renders with no steps (focused or unfocused) correctly', () => {
    component = createComponent({ ...propsWithoutSteps, reminders: [] });
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  });

  it('renders with no focused steps', () => {
    component = createComponent({ ...propsWithSteps, reminders: [] });
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  });

  it('renders screen with steps correctly', () => {
    component = createComponent(propsWithSteps);
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with max reminders', () => {
    const reminders = [
      { id: 11, reminder: true },
      { id: 12, reminder: true },
      { id: 13, reminder: true },
    ];

    component = createComponent({ ...propsWithSteps, reminders });
    component = stopLoad(component);
    expect(component).toMatchSnapshot();
  });

  describe('Background color changes with scrolling', () => {
    beforeEach(() => {
      component = createComponent(propsWithSteps);
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
        ...propsWithSteps,
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
        ...propsWithSteps,
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
        ...propsWithSteps,
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

  describe('arrow functions', () => {
    it('should render item correctly', () => {
      const component = createComponent(propsWithSteps);

      const renderedItem = component
        .instance()
        .renderItem({ item: propsWithSteps.steps[0], index: 0 });
      expect(renderedItem).toMatchSnapshot();
    });
    it('should list ref', () => {
      const instance = createComponent(propsWithSteps).instance();
      const ref = 'test';
      instance.listRef(ref);
      expect(instance.list).toEqual(ref);
    });
    it('should list key extractor', () => {
      const instance = createComponent(propsWithSteps).instance();
      const item = { id: '1' };
      const result = instance.listKeyExtractor(item);
      expect(result).toEqual(item.id);
    });
    it('should open main menu', () => {
      const instance = createComponent(propsWithSteps).instance();
      common.openMainMenu = jest.fn();
      instance.openMainMenu();
      expect(common.openMainMenu).toHaveBeenCalled();
    });
  });

  describe('handleRowSelect', () => {
    it('should navigate to person screen', () => {
      const step = propsWithSteps.steps[0];
      const { receiver, organization } = step;
      const screen = createComponent(propsWithSteps);
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
