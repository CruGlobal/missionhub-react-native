import React from 'react';
import * as reactNavigation from 'react-navigation';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { GifCompleteFlowScreens } from '../gifCompleteFlow';
import { navigatePush } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { ANALYTICS_CONTEXT_CHANGED } from '../../../actions/analytics';
import { ANALYTICS_PREVIOUS_SCREEN_NAME } from '../../../constants';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/journey');

const myId = '111';
const orgId = '123';

const initialState = {
  swipe: {
    completeStepExtraBack: false,
  },
  onboarding: {},
  drawer: {},
  analytics: {},
};

// @ts-ignore
const buildAndCallNext = (
  screen: keyof typeof GifCompleteFlowScreens,
  navParams: Record<string, string>,
) => {
  jest.useFakeTimers();
  const Component = GifCompleteFlowScreens[screen];

  const renderResult = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  fireEvent(renderResult.getByTestId('gif'), 'onLoad');

  jest.runAllTimers();

  return renderResult;
};

const navigatePushResponse = { type: 'navigate push' };
const reloadJourneyResponse = { type: 'reload journey' };
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  reactNavigation.StackActions.popToTop = jest
    .fn()
    .mockReturnValue(popToTopResponse);
  reactNavigation.StackActions.pop = jest.fn().mockReturnValue(popResponse);
  (reloadJourney as jest.Mock).mockReturnValue(reloadJourneyResponse);
});

describe('CelebrationScreen next', () => {
  it('should reload journey', () => {
    buildAndCallNext(CELEBRATION_SCREEN, { personId: myId, orgId });
    expect(reloadJourney).toHaveBeenCalledWith(myId);
  });

  it('should return to top of stack', () => {
    buildAndCallNext(CELEBRATION_SCREEN, { personId: myId, orgId });
    expect(reactNavigation.StackActions.popToTop).toHaveBeenCalledTimes(1);
  });

  it('should navigate back', () => {
    buildAndCallNext(CELEBRATION_SCREEN, { personId: myId, orgId });
    expect(reactNavigation.StackActions.pop).toHaveBeenCalledWith({
      immediate: true,
    });
  });

  it('should fire required next actions', () => {
    const { store } = buildAndCallNext(CELEBRATION_SCREEN, {
      personId: myId,
      orgId,
    });
    expect(store.getActions()).toEqual([
      {
        analyticsContext: {
          [ANALYTICS_PREVIOUS_SCREEN_NAME]: 'mh : gif',
        },
        type: ANALYTICS_CONTEXT_CHANGED,
      },
      reloadJourneyResponse,
      popToTopResponse,
      popResponse,
    ]);
  });
});
