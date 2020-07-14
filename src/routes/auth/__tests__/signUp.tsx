import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SignUpFlowScreens } from '../signUp';
import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { SIGN_UP_SCREEN } from '../../../containers/Auth/SignUpScreen';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
// @ts-ignore
import { innerResetToInitialRoute } from '../../../actions/navigationInit';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/navigationInit', () => {
  const innerResetToInitialRoute = jest.fn(() => ({
    type: 'resetToInitialRoute',
  }));
  return {
    resetToInitialRoute: jest.fn(() => innerResetToInitialRoute),
    innerResetToInitialRoute,
  };
});
(navigatePush as jest.Mock).mockReturnValue({ type: 'navigatePush' });

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

    expect(innerResetToInitialRoute).toHaveBeenCalled();
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

    expect(innerResetToInitialRoute).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_SCREEN);
  });
});
