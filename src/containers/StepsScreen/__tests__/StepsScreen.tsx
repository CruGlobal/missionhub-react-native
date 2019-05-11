/* eslint max-lines: 0 */

import React from 'react';
import { ScrollView, ViewStyle, NativeScrollEvent } from 'react-native';
import i18next from 'i18next';
import { fireEvent } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';

import { renderWithContext } from '../../../../testUtils';

import StepsScreen from '..';

import theme from '../../../theme';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';
import {
  showNotificationPrompt,
  showWelcomeNotification,
} from '../../../actions/notifications';
import { setStepFocus } from '../../../actions/steps';
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

const baseProps = {
  areNotificationsOff: true,
  hasMoreSteps: true,
  showNotificationReminder: true,
  showStepBump: true,
  showStepReminderBump: true,
  dispatch,
};

// @ts-ignore
common.toast = jest.fn();

describe('StepsScreen', () => {
  it('renders loading screen correctly', () => {
    renderWithContext(<StepsScreen />, {
      mockResolvers: {
        Query: () => ({
          acceptedChallenges: () => ({
            nodes: () => [],
          }),
        }),
      },
    }).snapshot();
  });

  it('renders empty screen with one reminder correctly', async () => {
    const { flushMicrotasksQueue, snapshot } = renderWithContext(
      <StepsScreen />,
      {
        mockResolvers: {
          Query: () => ({
            acceptedChallenges: () => ({
              nodes: () => new MockList(1, () => ({ focus: true })),
            }),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders with no steps (focused or unfocused) correctly', async () => {
    const { snapshot, flushMicrotasksQueue } = renderWithContext(
      <StepsScreen />,
      {
        mockResolvers: {
          Query: () => ({
            acceptedChallenges: () => ({
              nodes: () => [],
            }),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders with no focused steps correctly', async () => {
    const { snapshot, flushMicrotasksQueue } = renderWithContext(
      <StepsScreen />,
      {
        mockResolvers: {
          Query: () => ({
            acceptedChallenges: () => ({
              nodes: () => new MockList(4, () => ({ focus: false })),
            }),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders with no focused steps and less than 4 unfocused steps correctly', async () => {
    const { snapshot, flushMicrotasksQueue } = renderWithContext(
      <StepsScreen />,
      {
        mockResolvers: {
          Query: () => ({
            acceptedChallenges: () => ({
              nodes: () => new MockList(3, () => ({ focus: false })),
            }),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders screen with some focused and unfocused steps correctly', async () => {
    const { snapshot, flushMicrotasksQueue } = renderWithContext(
      <StepsScreen />,
      {
        mockResolvers: {
          Query: () => ({
            acceptedChallenges: () => ({
              nodes: () => [
                { focus: false },
                { focus: false },
                { focus: false },
                { focus: false },
                { focus: true },
              ],
            }),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
  });

  it('renders with max reminders correctly', async () => {
    const { snapshot, flushMicrotasksQueue } = renderWithContext(
      <StepsScreen />,
      {
        mockResolvers: {
          Query: () => ({
            acceptedChallenges: () => ({
              nodes: () => [
                { focus: false },
                { focus: false },
                { focus: false },
                { focus: false },
                { focus: true },
                { focus: true },
                { focus: true },
              ],
            }),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
  });

  describe('Scrolling Events', () => {
    const testScroll = async () => {
      const { snapshot, flushMicrotasksQueue, getByType } = renderWithContext(
        <StepsScreen />,
        {
          mockResolvers: {
            Query: () => ({
              acceptedChallenges: () => ({
                nodes: () => [
                  { focus: false },
                  { focus: false },
                  { focus: false },
                  { focus: false },
                  { focus: true },
                  { focus: true },
                  { focus: true },
                ],
                pageInfo: () => ({ hasNextPage: true }),
              }),
            }),
          },
        },
      );

      await flushMicrotasksQueue();

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
        snapshot,
        flushMicrotasksQueue,
      };
    };

    it('Starts with white background', async () => {
      const { getBackgroundColor } = await testScroll();

      expect(getBackgroundColor()).toEqual(theme.white);
    });

    it('Background is blue when overscrolling up', async () => {
      const { scrollUp, getBackgroundColor } = await testScroll();

      scrollUp();
      expect(getBackgroundColor()).toEqual(theme.backgroundColor);
    });

    it('Background is white when scrolling back down', async () => {
      const { scrollUp, scrollDown, getBackgroundColor } = await testScroll();

      scrollUp();
      scrollDown();
      expect(getBackgroundColor()).toEqual(theme.white);
    });

    it('should show loading indicator when scrolling close to bottom', async () => {
      const { scrollDown, snapshot } = await testScroll();
      scrollDown(180);

      snapshot();
    });

    it('should load more when scrolling close to bottom', async () => {
      const { scrollDown, flushMicrotasksQueue, snapshot } = await testScroll();
      scrollDown(180);

      await flushMicrotasksQueue();
      snapshot();
    });

    it('should not load more when not scrolling close to bottom', async () => {
      const { scrollDown, flushMicrotasksQueue, snapshot } = await testScroll();
      scrollDown(179);

      await flushMicrotasksQueue();
      snapshot();
    });

    it('should not load more if already paging', async () => {
      jest.useFakeTimers();
      const {
        scrollDown,
        scrollUp,
        flushMicrotasksQueue,
        snapshot,
      } = await testScroll();
      // TODO: test always passes even if already paging
      scrollDown(180);
      // act(() => jest.runAllTimers());
      scrollUp();
      scrollDown();
      // act(() => jest.runAllTimers());

      await flushMicrotasksQueue();
      snapshot();
    });
  });

  xdescribe('handleSetReminder', () => {
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

  xdescribe('handleRemoveReminder', () => {
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

  xdescribe('Header', () => {
    it('should open main menu', () => {
      // @ts-ignore
      common.openMainMenu = jest.fn();

      const { getByProps } = renderWithContext(<StepsScreen {...baseProps} />);

      getByProps({ title: 'STEPS OF FAITH' }).props.left.props.onPress();
      expect(common.openMainMenu).toHaveBeenCalled();
    });
  });

  xdescribe('handleRowSelect', () => {
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
