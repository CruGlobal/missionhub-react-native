import React from 'react';
import * as reactNavigation from 'react-navigation';

import { renderWithContext } from '../../../../testUtils';
import { GifCompleteFlowScreens } from '../gifCompleteFlow';
import { navigatePush } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

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
      reloadJourneyResponse,
      popToTopResponse,
      popResponse,
    ]);
  });
});
