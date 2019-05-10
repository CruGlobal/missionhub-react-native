/* eslint max-lines: 0 */

import { ScrollView, ViewStyle, NativeScrollEvent } from 'react-native';
import React from 'react';
import i18next from 'i18next';
import { fireEvent, act } from 'react-native-testing-library';

import { snapshotWithContext, renderWithContext } from '../../../../testUtils';

import { StepsScreen, mapStateToProps } from '..';

import theme from '../../../theme';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';
import {
  showNotificationPrompt,
  showWelcomeNotification,
} from '../../../actions/notifications';
import { setStepFocus, getMyStepsNextPage } from '../../../actions/steps';
import * as common from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../AcceptedStepDetailScreen';

jest.mock('../../../selectors/steps');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/person');
jest.mock('../../TrackTabChange', () => () => null);

jest.mock('../../../components/common', () => ({
  Flex: 'Flex',
  Text: 'Text',
  Icon: 'Icon',
  IconButton: 'IconButton',
  RefreshControl: 'RefreshControl',
  LoadingGuy: 'LoadingGuy',
}));
jest.mock('../../../components/FooterLoading', () => 'FooterLoading');
jest.mock('../../../components/Header', () => 'Header');
jest.mock('../../../components/StepItem', () => 'StepItem');
jest.mock(
  '../../TakeAStepWithSomeoneButton',
  () => 'TakeAStepWithSomeoneButton',
);

const dispatch = jest.fn(async () => {});

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

// @ts-ignore
common.toast = jest.fn();

describe('StepsScreen', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      reminderStepsSelector.mockReturnValue([{ id: 1, reminder: true }]);
      nonReminderStepsSelector.mockReturnValue([{ id: 2 }, { id: 3 }]);
      expect(mapStateToProps(store)).toMatchSnapshot();
    });
  });

  it('renders loading screen correctly', () => {
    snapshotWithContext(
      <StepsScreen {...baseProps} reminders={[]} steps={null} />,
    );
  });

  it('renders empty screen with one reminder correctly', () => {
    snapshotWithContext(
      <StepsScreen
        {...baseProps}
        reminders={reminders.slice(0, 1)}
        steps={[]}
      />,
    );
  });

  it('renders with no steps (focused or unfocused) correctly', () => {
    snapshotWithContext(
      <StepsScreen {...baseProps} reminders={[]} steps={[]} />,
    );
  });

  it('renders with no focused steps correctly', () => {
    snapshotWithContext(
      <StepsScreen {...baseProps} reminders={[]} steps={steps} />,
    );
  });

  it('renders with no focused steps and less than 4 unfocused steps correctly', () => {
    snapshotWithContext(
      <StepsScreen {...baseProps} reminders={[]} steps={steps.slice(0, 3)} />,
    );
  });

  it('renders screen with some focused and unfocused steps correctly', () => {
    snapshotWithContext(
      <StepsScreen
        {...baseProps}
        reminders={reminders.slice(0, 1)}
        steps={steps}
      />,
    );
  });

  it('renders with max reminders correctly', () => {
    snapshotWithContext(
      <StepsScreen {...baseProps} reminders={reminders} steps={steps} />,
    );
  });

  describe('Scrolling Events', () => {
    const testScroll = () => {
      const { toJSON, getByType } = renderWithContext(
        <StepsScreen {...baseProps} />,
      );
      const scrollView = getByType(ScrollView);

      const createScrollData = (yOffset: number) => ({
        contentOffset: { x: 0, y: yOffset },
        layoutMeasurement: { width: 400, height: 200 },
        contentSize: { width: 400, height: 400 },
        contentInset: { left: 0, top: 0, bottom: 0, right: 0 },
        zoomScale: 1,
      });

      const fireScroll = (scrollEvent: NativeScrollEvent) =>
        fireEvent.scroll(scrollView, { nativeEvent: scrollEvent });

      return {
        scrollUp: (offset: number = 1) =>
          fireScroll(createScrollData(-1 * offset)),
        scrollDown: (offset: number = 1) =>
          fireScroll(createScrollData(offset)),
        getBackgroundColor: () =>
          scrollView.props.style.find((element: ViewStyle) => {
            return element.backgroundColor;
          }).backgroundColor,
        toJSON,
      };
    };

    it('Starts with white background', () => {
      const { getBackgroundColor } = testScroll();

      expect(getBackgroundColor()).toEqual(theme.white);
    });

    it('Background is blue when overscrolling up', () => {
      const { scrollUp, getBackgroundColor } = testScroll();

      scrollUp();
      expect(getBackgroundColor()).toEqual(theme.backgroundColor);
    });

    it('Background is white when scrolling back down', () => {
      const { scrollUp, scrollDown, getBackgroundColor } = testScroll();

      scrollUp();
      scrollDown();
      expect(getBackgroundColor()).toEqual(theme.white);
    });

    it('should load more when scrolling close to bottom', () => {
      jest.useFakeTimers();
      const { scrollDown, toJSON } = testScroll();
      scrollDown(180);

      act(() => jest.runAllTimers());
      expect(getMyStepsNextPage).toHaveBeenCalled();
      expect(toJSON()).toMatchSnapshot();
    });

    it('should not load more when not scrolling close to bottom', () => {
      jest.useFakeTimers();
      const { scrollDown, toJSON } = testScroll();
      scrollDown(179);

      act(() => jest.runAllTimers());
      expect(getMyStepsNextPage).not.toHaveBeenCalled();
      expect(toJSON()).toMatchSnapshot();
    });

    it('should not load more if already paging', () => {
      jest.useFakeTimers();
      const { scrollDown, scrollUp } = testScroll();
      scrollDown(180);
      act(() => jest.runAllTimers());
      scrollUp();
      scrollDown();
      act(() => jest.runAllTimers());

      expect(getMyStepsNextPage).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSetReminder', () => {
    it('should focus a step', () => {
      const { getByProps } = renderWithContext(
        <StepsScreen {...baseProps} reminders={[]} />,
      );

      getByProps({ step: steps[0] }).props.onAction('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(common.toast).toHaveBeenCalledWith('✔ Reminder Added');
      expect(setStepFocus).toHaveBeenCalledWith('testStep', true);
      expect(showNotificationPrompt).toHaveBeenCalledWith(
        i18next.t('notificationPrimer:focusDescription'),
      );
      expect(showWelcomeNotification).toHaveBeenCalled();
    });

    it('should focus a step and not show notification reminder screen if reminders already exist', () => {
      const { getByProps } = renderWithContext(
        <StepsScreen {...baseProps} reminders={['someStep']} />,
      );

      getByProps({ step: steps[0] }).props.onAction('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(common.toast).toHaveBeenCalledWith('✔ Reminder Added');
      expect(setStepFocus).toHaveBeenCalledWith('testStep', true);
      expect(showNotificationPrompt).not.toHaveBeenCalled();
      expect(showWelcomeNotification).toHaveBeenCalled();
    });

    it('should not focus a step when reminders slots are filled', () => {
      const { getByProps } = renderWithContext(
        <StepsScreen {...baseProps} reminders={['step1', 'step2', 'step3']} />,
      );

      getByProps({ step: steps[0] }).props.onAction('testStep');

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_PRIORITIZED,
      );
      expect(common.toast).not.toHaveBeenCalled();
      expect(setStepFocus).not.toHaveBeenCalled();
      expect(showNotificationPrompt).not.toHaveBeenCalled();
      expect(showWelcomeNotification).not.toHaveBeenCalled();
    });
  });

  describe('handleRemoveReminder', () => {
    it('should remove reminder', () => {
      const step = { id: '1', title: 'some step' };
      const { getByProps } = renderWithContext(
        <StepsScreen {...baseProps} reminders={[step]} />,
      );

      getByProps({ step }).props.onAction(step);

      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.STEP_DEPRIORITIZED,
      );
      expect(setStepFocus).toHaveBeenCalledWith(step, false);
    });
  });

  describe('Header', () => {
    it('should open main menu', () => {
      // @ts-ignore
      common.openMainMenu = jest.fn();

      const { getByProps } = renderWithContext(<StepsScreen {...baseProps} />);

      getByProps({ title: 'STEPS OF FAITH' }).props.left.props.onPress();
      expect(common.openMainMenu).toHaveBeenCalled();
    });
  });

  describe('handleRowSelect', () => {
    it('should navigate to person screen', () => {
      const step = baseProps.steps[0];
      const { getByProps } = renderWithContext(
        <StepsScreen {...baseProps} steps={[step]} />,
      );

      getByProps({ step }).props.onSelect(step);

      expect(navigatePush).toHaveBeenCalledWith(ACCEPTED_STEP_DETAIL_SCREEN, {
        step,
      });
    });
  });
});
