import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SignInFlowScreens } from '../signIn';
import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { navigateToPostAuthScreen } from '../../../actions/auth/auth';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
import { MFA_CODE_SCREEN } from '../../../containers/Auth/MFACodeScreen';

jest.mock('../../../actions/auth/auth');
jest.mock('../../../actions/navigation');
navigatePush.mockReturnValue(() => {});
navigateToPostAuthScreen.mockReturnValue(() => {});

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
        .props.next(),
    );

    expect(navigateToPostAuthScreen).toHaveBeenCalled();
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
        .props.next({
          requires2FA: true,
          email,
          password,
        }),
    );

    expect(navigateToPostAuthScreen).not.toHaveBeenCalled();
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
        .props.next(),
    );

    expect(navigateToPostAuthScreen).toHaveBeenCalled();
  });
});
