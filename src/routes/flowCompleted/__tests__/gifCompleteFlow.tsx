import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reactNavigation from 'react-navigation';

import { renderShallow } from '../../../../testUtils';
import { GifCompleteFlowScreens } from '../gifCompleteFlow';
import { navigatePush } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/journey');

const myId = '111';
const orgId = '123';

const store = configureStore([thunk])({
  swipe: {
    completeStepExtraBack: false,
  },
});

// @ts-ignore
const buildAndCallNext = async (screen, navParams, nextProps) => {
  // @ts-ignore
  const Component = GifCompleteFlowScreens[screen];

  await store.dispatch(
    renderShallow(
      <Component
        navigation={{
          state: {
            params: navParams,
          },
        }}
      />,
      store,
    )
      .instance()
      // @ts-ignore
      .props.next(nextProps),
  );
};

const navigatePushResponse = { type: 'navigate push' };
const reloadJourneyResponse = { type: 'reload journey' };
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };

beforeEach(() => {
  store.clearActions();
  // @ts-ignore
  navigatePush.mockReturnValue(navigatePushResponse);
  reactNavigation.StackActions.popToTop = jest
    .fn()
    .mockReturnValue(popToTopResponse);
  reactNavigation.StackActions.pop = jest.fn().mockReturnValue(popResponse);
  // @ts-ignore
  reloadJourney.mockReturnValue(reloadJourneyResponse);
});

describe('CelebrationScreen next', () => {
  beforeEach(async () => {
    await buildAndCallNext(
      CELEBRATION_SCREEN,
      { personId: myId, orgId },
      { personId: myId, orgId },
    );
  });

  it('should reload journey', () => {
    expect(reloadJourney).toHaveBeenCalledWith(myId);
  });

  it('should return to top of stack', () => {
    expect(reactNavigation.StackActions.popToTop).toHaveBeenCalledTimes(1);
  });

  it('should navigate back', () => {
    expect(reactNavigation.StackActions.pop).toHaveBeenCalledWith({
      immediate: true,
    });
  });

  it('should fire required next actions', () => {
    expect(store.getActions()).toEqual([
      reloadJourneyResponse,
      popToTopResponse,
      popResponse,
    ]);
  });
});
