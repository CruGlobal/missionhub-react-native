import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CreateCommunityUnauthenticatedFlowScreens } from '../createCommunityUnauthenticatedFlow';
import { renderShallow } from '../../../../testUtils';
import { navigateNestedReset, navigatePush } from '../../../actions/navigation';
import { SIGN_UP_SCREEN } from '../../../containers/Auth/SignUpScreen';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
import { MAIN_TABS } from '../../../constants';
import { CREATE_GROUP_SCREEN } from '../../../containers/Groups/CreateGroupScreen';
import { navigateToPostAuthScreen } from '../../../actions/auth/auth';
import { MFA_CODE_SCREEN } from '../../../containers/Auth/MFACodeScreen';

jest.mock('../../../actions/auth/auth');
jest.mock('../../../actions/navigation');
navigatePush.mockReturnValue(() => {});
navigateNestedReset.mockReturnValue(() => {});
const email = 'test@test.com';
const password = 'test1234';

const store = configureStore([thunk])();

describe('SignUpScreen next', () => {
  it('should navigate to create group screen', async () => {
    const Component =
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
        .dive()
        .instance()
        .props.next(),
    );

    expect(navigateNestedReset).toHaveBeenCalledWith(
      MAIN_TABS,
      CREATE_GROUP_SCREEN,
    );
  });
  it('should navigate to sign in screen', async () => {
    const Component =
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
        .dive()
        .instance()
        .props.next({
          signIn: true,
        }),
    );

    expect(navigateNestedReset).not.toHaveBeenCalled();
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
        .props.next(),
    );

    expect(navigateNestedReset).toHaveBeenCalledWith(
      MAIN_TABS,
      CREATE_GROUP_SCREEN,
    );
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
        .props.next(),
    );

    expect(navigateNestedReset).toHaveBeenCalledWith(
      MAIN_TABS,
      CREATE_GROUP_SCREEN,
    );
  });
});
