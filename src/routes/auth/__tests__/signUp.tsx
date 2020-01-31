import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SignUpFlowScreens } from '../signUp';
import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
// @ts-ignore
import { innerNavigateToPostAuthScreen } from '../../../actions/auth/auth'; //eslint-disable-line import/named
import { SIGN_UP_SCREEN } from '../../../containers/Auth/SignUpScreen';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';

jest.mock('../../../actions/auth/auth', () => ({
  get navigateToPostAuthScreen() {
    // @ts-ignore
    return () => this.innerNavigateToPostAuthScreen;
  },
  innerNavigateToPostAuthScreen: jest.fn(),
}));
jest.mock('../../../actions/navigation');
// @ts-ignore
navigatePush.mockReturnValue(() => {});

const store = configureStore([thunk])();

describe('SignUpScreen next', () => {
  it('should finish auth', async () => {
    // @ts-ignore
    const Component = SignUpFlowScreens[SIGN_UP_SCREEN].screen;

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

    expect(innerNavigateToPostAuthScreen).toHaveBeenCalled();
  });
  it('should navigate to sign in screen', async () => {
    // @ts-ignore
    const Component = SignUpFlowScreens[SIGN_UP_SCREEN].screen;

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

    expect(innerNavigateToPostAuthScreen).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_SCREEN);
  });
});