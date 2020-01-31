import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CreateCommunityUnauthenticatedFlowScreens } from '../createCommunityUnauthenticatedFlow';
import { renderShallow } from '../../../../testUtils';
import {
  navigatePush,
  // @ts-ignore
  innerNavigateNestedReset, //eslint-disable-line import/named
} from '../../../actions/navigation';
import { SIGN_UP_SCREEN } from '../../../containers/Auth/SignUpScreen';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
import { MAIN_TABS } from '../../../constants';
import { CREATE_GROUP_SCREEN } from '../../../containers/Groups/CreateGroupScreen';
import { MFA_CODE_SCREEN } from '../../../containers/Auth/MFACodeScreen';

jest.mock('../../../actions/auth/auth');
jest.mock('../../../actions/navigation', () => ({
  get navigateNestedReset() {
    // @ts-ignore
    return originalArgs =>
      // @ts-ignore
      this.innerNavigateNestedReset.mockImplementation(dispatch =>
        dispatch({
          type: 'navigateNestedReset test action',
          originalArgs,
        }),
      );
  },
  innerNavigateNestedReset: jest.fn(),
  navigatePush: jest.fn().mockReturnValue(() => {}),
}));

const email = 'test@test.com';
const password = 'test1234';

const store = configureStore([thunk])();

beforeEach(() => store.clearActions());

describe('SignUpScreen next', () => {
  it('should navigate to create group screen', async () => {
    const Component =
      // @ts-ignore
      CreateCommunityUnauthenticatedFlowScreens[SIGN_UP_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: {} },
          }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(innerNavigateNestedReset).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      {
        type: 'navigateNestedReset test action',
        originalArgs: [
          { routeName: MAIN_TABS },
          { routeName: CREATE_GROUP_SCREEN },
        ],
      },
    ]);
  });
  it('should navigate to sign in screen', async () => {
    const Component =
      // @ts-ignore
      CreateCommunityUnauthenticatedFlowScreens[SIGN_UP_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: {} },
          }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next({
          signIn: true,
        }),
    );

    expect(innerNavigateNestedReset).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_SCREEN);
  });
});

describe('SignInScreen next', () => {
  it('sshould navigate to create group screen', async () => {
    const Component =
      CreateCommunityUnauthenticatedFlowScreens[SIGN_IN_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: {} },
          }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(innerNavigateNestedReset).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      {
        type: 'navigateNestedReset test action',
        originalArgs: [
          { routeName: MAIN_TABS },
          { routeName: CREATE_GROUP_SCREEN },
        ],
      },
    ]);
  });
  it('should navigate to mfa code screen', async () => {
    const Component =
      CreateCommunityUnauthenticatedFlowScreens[SIGN_IN_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: {} },
          }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next({
          requires2FA: true,
          email,
          password,
        }),
    );

    expect(innerNavigateNestedReset).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(MFA_CODE_SCREEN, {
      email,
      password,
    });
  });
});

describe('MFACodeScreen next', () => {
  it('should navigate to create group screen', async () => {
    const Component =
      CreateCommunityUnauthenticatedFlowScreens[MFA_CODE_SCREEN].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: { email, password } },
          }}
        />,
        store,
      )
        .instance()
        // @ts-ignore
        .props.next(),
    );

    expect(innerNavigateNestedReset).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      {
        type: 'navigateNestedReset test action',
        originalArgs: [
          { routeName: MAIN_TABS },
          { routeName: CREATE_GROUP_SCREEN },
        ],
      },
    ]);
  });
});
