import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { SIGN_UP_SCREEN } from '../../../containers/Auth/SignUpScreen';
import { SIGN_IN_SCREEN } from '../../../containers/Auth/SignInScreen';
import { MFA_CODE_SCREEN } from '../../../containers/Auth/MFACodeScreen';
import { authFlowGenerator } from '../authFlowGenerator';
import { useAuth } from '../../../auth/useAuth';
import { AuthError } from '../../../auth/constants';

jest.mock('../../../actions/navigation');
(navigatePush as jest.Mock).mockReturnValue(() => {});
jest.mock('../../../auth/useAuth');

const authenticate = jest.fn();
(useAuth as jest.Mock).mockReturnValue({ authenticate });

const initialState = { onboarding: {}, drawer: {}, analytics: {} };

const completeAction = jest.fn();

const testFlow = authFlowGenerator({
  includeSignUp: true,
  completeAction: completeAction,
});

beforeEach(() => {
  authenticate.mockResolvedValue(undefined);
});

describe('SignUpScreen next', () => {
  it('should finish auth', async () => {
    const Component = testFlow[SIGN_UP_SCREEN].screen;

    const { getByTestId } = renderWithContext(<Component />, {
      initialState,
    });

    await fireEvent(getByTestId('signUpSocialAuthButtons'), 'authenticate');

    expect(completeAction).toHaveBeenCalled();
  });
  it('should navigate to sign in screen', async () => {
    const Component = testFlow[SIGN_UP_SCREEN].screen;

    const { getByTestId } = renderWithContext(<Component />, {
      initialState,
    });

    fireEvent.press(getByTestId('loginButton'));

    expect(completeAction).not.toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(SIGN_IN_SCREEN);
  });
});

const email = 'test@test.com';
const password = 'test1234';

describe('SignInScreen next', () => {
  it('should finish auth', async () => {
    const Component = testFlow[SIGN_IN_SCREEN].screen;

    const { getByTestId } = renderWithContext(<Component />, { initialState });

    await fireEvent(getByTestId('signInSocialAuthButtons'), 'authenticate');

    expect(completeAction).toHaveBeenCalled();
  });
  it('should navigate to mfa code screen', async () => {
    const Component = testFlow[SIGN_IN_SCREEN].screen;

    authenticate.mockRejectedValue(AuthError.MfaRequired);

    const { getByTestId } = renderWithContext(<Component />, {
      initialState,
    });

    fireEvent.changeText(getByTestId('emailInput'), email);
    fireEvent.changeText(getByTestId('passwordInput'), password);
    await fireEvent.press(getByTestId('loginButton'));

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

    const { getByTestId } = renderWithContext(<Component />, {
      initialState,
      navParams: { email, password },
    });

    await fireEvent(getByTestId('MFACodeComponent'), 'onSubmit');

    expect(completeAction).toHaveBeenCalled();
  });
});
