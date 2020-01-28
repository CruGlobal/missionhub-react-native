import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SignInFlowScreens } from '../signIn';
import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
// @ts-ignore
import { innerNavigateToPostAuthScreen } from '../../../actions/auth/auth'; //eslint-disable-line import/named
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
import { MFA_CODE_SCREEN } from '../../../containers/Auth/MFACodeScreen';

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

const email = 'test@test.com';
const password = 'test1234';

describe('SignInScreen next', () => {
  it('should finish auth', async () => {
    const Component = SignInFlowScreens[SIGN_IN_SCREEN].screen;

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
  it('should navigate to mfa code screen', async () => {
    const Component = SignInFlowScreens[SIGN_IN_SCREEN].screen;

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

    expect(innerNavigateToPostAuthScreen).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(MFA_CODE_SCREEN, {
      email,
      password,
    });
  });
});
describe('MFACodeScreen next', () => {
  it('should finish auth', async () => {
    const Component = SignInFlowScreens[MFA_CODE_SCREEN].screen;

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

    expect(innerNavigateToPostAuthScreen).toHaveBeenCalled();
  });
});
