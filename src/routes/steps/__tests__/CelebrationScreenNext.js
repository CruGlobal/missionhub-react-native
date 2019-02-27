import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reactNavigation from 'react-navigation';

import { renderShallow } from '../../../../testUtils';
import { CompleteStepFlowScreens } from '../completeStepFlow';
import { navigatePush } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/journey');

const myId = '111';
const orgId = '123';

let store = configureStore([thunk])();

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = CompleteStepFlowScreens[screen];

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
      .props.next(nextProps),
  );
};

const navigatePushResponse = { type: 'navigate push' };
const reloadJourneyResponse = { type: 'reload journey' };
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
  navigatePush.mockReturnValue(navigatePushResponse);
  reactNavigation.StackActions.popToTop = jest
    .fn()
    .mockReturnValue(popToTopResponse);
  reactNavigation.StackActions.pop = jest.fn().mockReturnValue(popResponse);
  reloadJourney.mockReturnValue(reloadJourneyResponse);
});

describe('CelebrationScreen next', () => {
  describe('extra back is false', () => {
    beforeEach(async () => {
      store = configureStore([thunk])({
        swipe: {
          completeStepExtraBack: false,
        },
      });

      await buildAndCallNext(
        CELEBRATION_SCREEN,
        { contactId: myId, orgId },
        { contactId: myId, orgId },
      );
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
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
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('extra back is true', () => {
    beforeEach(async () => {
      store = configureStore([thunk])({
        swipe: {
          completeStepExtraBack: true,
        },
      });

      await buildAndCallNext(
        CELEBRATION_SCREEN,
        { contactId: myId, orgId },
        { contactId: myId, orgId },
      );
    });

    it('should reload journey', () => {
      expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
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
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
