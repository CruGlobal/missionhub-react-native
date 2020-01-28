import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { SIGN_UP_SCREEN } from '../../../containers/Auth/SignUpScreen';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
import { MFA_CODE_SCREEN } from '../../../containers/Auth/MFACodeScreen';
import { authFlowGenerator } from '../authFlowGenerator';

jest.mock('../../../actions/navigation');
// @ts-ignore
navigatePush.mockReturnValue(() => {});

const store = configureStore([thunk])();

const completeAction = jest.fn();

const testFlow = authFlowGenerator({
  includeSignUp: true,
  completeAction: completeAction,
});

describe('SignUpScreen next', () => {
  it('should finish auth', async () => {
    // @ts-ignore
    const Component = testFlow[SIGN_UP_SCREEN].screen;

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

    expect(completeAction).toHaveBeenCalled();
  });
  it('should navigate to sign in screen', async () => {
    // @ts-ignore
    const Component = testFlow[SIGN_UP_SCREEN].screen;

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

    expect(completeAction).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_SCREEN);
  });
});

const email = 'test@test.com';
const password = 'test1234';

describe('SignInScreen next', () => {
  it('should finish auth', async () => {
    const Component = testFlow[SIGN_IN_SCREEN].screen;

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

    expect(completeAction).toHaveBeenCalled();
  });
  it('should navigate to mfa code screen', async () => {
    const Component = testFlow[SIGN_IN_SCREEN].screen;

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

    expect(completeAction).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(MFA_CODE_SCREEN, {
      email,
      password,
    });
  });
});

describe('MFACodeScreen next', () => {
  it('should finish auth', async () => {
    const Component = testFlow[MFA_CODE_SCREEN].screen;

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

    expect(completeAction).toHaveBeenCalled();
  });
});
