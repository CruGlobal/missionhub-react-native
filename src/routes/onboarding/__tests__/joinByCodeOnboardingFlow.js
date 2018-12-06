import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { JOIN_GROUP_SCREEN } from '../../../containers/Groups/JoinGroupScreen';
import { JoinByCodeOnboardingFlowScreens } from '../joinByCodeOnboardingFlow';
import { renderShallow } from '../../../../testUtils';
import callApi, { REQUESTS } from '../../../actions/api';
import { STASH_COMMUNITY_TO_JOIN } from '../../../constants';
import { WELCOME_SCREEN } from '../../../containers/WelcomeScreen';
import { SETUP_SCREEN } from '../../../containers/SetupScreen';
import * as navigationActions from '../../../actions/navigation';
import { GROUP_SCREEN } from '../../../containers/Groups/GroupScreen';

jest.mock('../../../actions/api');

const community = { id: '1', community_code: '123456' };

const store = configureStore([thunk])({
  auth: { person: { id: '1' } },
  profile: {
    firstName: 'Test',
    community,
  },
});

beforeEach(() => {
  store.clearActions();
  callApi.mockClear();
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeOnboardingFlowScreens[JOIN_GROUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component />, store)
        .instance()
        .props.next({
          community,
        }),
    );

    expect(store.getActions()).toEqual([
      {
        type: STASH_COMMUNITY_TO_JOIN,
        community,
      },
      { params: {}, routeName: WELCOME_SCREEN, type: 'Navigation/NAVIGATE' },
    ]);
  });
});

describe('WelcomeScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeOnboardingFlowScreens[WELCOME_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component navigation={{ state: {} }} />, store)
        .instance()
        .props.next(),
    );

    expect(store.getActions()).toEqual([
      { params: {}, routeName: SETUP_SCREEN, type: 'Navigation/NAVIGATE' },
    ]);
  });
});

describe('SetupScreen next', () => {
  it('should fire required next actions', async () => {
    callApi.mockReturnValue(() => Promise.resolve());
    navigationActions.navigatePush = jest.fn((_, { onComplete }) =>
      onComplete(),
    );

    const Component = JoinByCodeOnboardingFlowScreens[SETUP_SCREEN].screen;

    await store.dispatch(
      renderShallow(<Component />, store)
        .instance()
        .props.next(),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.JOIN_COMMUNITY,
      {},
      {
        data: {
          attributes: {
            community_code: '123456',
            organization_id: '1',
            permission_id: 4,
            person_id: '1',
          },
          type: 'organizational_permission',
        },
      },
    );

    expect(store.getActions()).toEqual([
      { type: 'app/FIRST_TIME' },
      { type: 'app/COMPLETE_ONBOARDING' },
      {
        actions: [
          {
            params: { organization: community },
            routeName: GROUP_SCREEN,
            type: 'Navigation/NAVIGATE',
          },
        ],
        index: 0,
        key: null,
        type: 'Navigation/RESET',
      },
    ]);
  });
});
