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

const store = configureStore([thunk])();

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

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('CelebrationScreen next', () => {
  const reloadJourneyResponse = { type: 'reload journey' };
  const popToTopResponse = { type: 'pop to top of stack' };
  const popResponse = { type: 'pop once' };

  beforeEach(() => {
    reactNavigation.StackActions.popToTop = jest
      .fn()
      .mockReturnValue(popToTopResponse);
    reactNavigation.StackActions.pop = jest.fn().mockReturnValue(popResponse);
    reloadJourney.mockReturnValue(reloadJourneyResponse);
  });

  it('should fire required next actions', async () => {
    await buildAndCallNext(
      CELEBRATION_SCREEN,
      { contactId: myId, orgId },
      { contactId: myId, orgId },
    );

    expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
    expect(reactNavigation.StackActions.popToTop).toHaveBeenCalledTimes(1);
    expect(reactNavigation.StackActions.pop).toHaveBeenCalledWith({
      immediate: true,
    });
    expect(store.getActions()).toMatchSnapshot();
  });
});
