import 'react-native';
import React from 'react';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import SignInScreen from '..';
import { useAuth } from '../../../../auth/useAuth';
import { IdentityProvider, AuthError } from '../../../../auth/constants';
import { SignInWithTheKeyType } from '../../../../auth/providers/useSignInWithTheKey';

jest.mock('../../../../actions/analytics');
jest.mock('../../../../auth/useAuth');
jest.mock('../../../../reducers/nav', () => null);
let keyboardListeners: { [name: string]: () => void };
jest.mock('../../../../utils/hooks/useKeyboardListeners', () => ({
  useKeyboardListeners: ({
    onShow,
    onHide,
  }: {
    onShow: () => void;
    onHide: () => void;
  }) => (keyboardListeners = { onShow, onHide }),
}));
jest.mock('../../../../utils/hooks/useAnalytics');

jest.mock('../../../../components/common', () => ({
  Button: 'Button',
  Text: 'Text',
  Flex: 'Flex',
  Icon: 'Icon',
  LoadingWheel: 'LoadingWheel',
  Input: 'Input',
}));
jest.mock(
  '../../../../containers/DeprecatedBackButton',
  () => 'DeprecatedBackButton',
);
jest.mock('../../../../components/Header', () => 'Header');

const next = jest.fn(() => () => {});

const credentials = {
  email: 'klas&jflk@lkjasdf.com',
  password: 'this&is=unsafe',
};

const authenticate = jest.fn();

beforeEach(() => {
  (useAuth as jest.Mock).mockReturnValue({ authenticate });
});

it('renders correctly', () => {
  renderWithContext(<SignInScreen next={next} />).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('sign in');
});

it('renders correctly for forced logout', () => {
  renderWithContext(<SignInScreen next={next} />, {
    navParams: { forcedLogout: true },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('sign in');
});

describe('keyboard listeners', () => {
  it('should hide sign in logo when the keyboard is shown', () => {
    const { recordSnapshot, diffSnapshot } = renderWithContext(
      <SignInScreen next={next} />,
    );

    recordSnapshot();

    act(() => keyboardListeners.onShow());

    diffSnapshot();
  });
  it('should show sign in logo when the keyboard is hidden', () => {
    const { recordSnapshot, diffSnapshot } = renderWithContext(
      <SignInScreen next={next} />,
    );

    act(() => keyboardListeners.onShow());

    recordSnapshot();

    act(() => keyboardListeners.onHide());

    diffSnapshot();
  });
});

describe('social auth buttons', () => {
  it('should call authenticate when pressed', async () => {
    const { getByTestId } = renderWithContext(<SignInScreen next={next} />);

    fireEvent(
      getByTestId('signInSocialAuthButtons'),
      'authenticate',
      'authenticateOptions',
    );
    await flushMicrotasksQueue();

    expect(authenticate).toHaveBeenCalledWith('authenticateOptions');
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('key login button is pressed', () => {
  const performKeyLogin = async () => {
    const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
      <SignInScreen next={next} />,
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('emailInput'), credentials.email);
    fireEvent.changeText(getByTestId('passwordInput'), credentials.password);
    fireEvent.press(getByTestId('loginButton'));
    await flushMicrotasksQueue();
    diffSnapshot();
  };

  it('key login is called', async () => {
    await performKeyLogin();

    expect(authenticate).toHaveBeenCalledWith({
      provider: IdentityProvider.TheKey,
      theKeyOptions: {
        type: SignInWithTheKeyType.EmailPassword,
        email: credentials.email,
        password: credentials.password,
      },
    });
    expect(next).toHaveBeenCalled();
  });

  it('should fire login actions when inputs are submitted', async () => {
    const { getByTestId } = renderWithContext(<SignInScreen next={next} />);

    fireEvent.changeText(getByTestId('emailInput'), credentials.email);
    fireEvent(getByTestId('emailInput'), 'submitEditing');
    fireEvent.changeText(getByTestId('passwordInput'), credentials.password);
    fireEvent(getByTestId('passwordInput'), 'submitEditing');
    await flushMicrotasksQueue();

    expect(authenticate).toHaveBeenCalledWith({
      provider: IdentityProvider.TheKey,
      theKeyOptions: {
        type: SignInWithTheKeyType.EmailPassword,
        email: credentials.email,
        password: credentials.password,
      },
    });
    expect(next).toHaveBeenCalled();
  });

  it('should not call next when an auth error is thrown', async () => {
    authenticate.mockRejectedValue(AuthError.Unknown);

    await performKeyLogin();
    await flushMicrotasksQueue();

    expect(authenticate).toHaveBeenCalledWith({
      provider: IdentityProvider.TheKey,
      theKeyOptions: {
        type: SignInWithTheKeyType.EmailPassword,
        email: credentials.email,
        password: credentials.password,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  describe('mfa_required is returned from the Key', () => {
    it('should send user to MFA screen and clear credentials', async () => {
      authenticate.mockRejectedValue(AuthError.MfaRequired);

      await performKeyLogin();
      await flushMicrotasksQueue();

      expect(authenticate).toHaveBeenCalledWith({
        provider: IdentityProvider.TheKey,
        theKeyOptions: {
          type: SignInWithTheKeyType.EmailPassword,
          email: credentials.email,
          password: credentials.password,
        },
      });
      expect(next).toHaveBeenCalledWith({
        requires2FA: true,
        email: credentials.email,
        password: credentials.password,
      });
    });
  });
});

describe('forgot password button is pressed', () => {
  it('should call forgot password logic', async () => {
    const { getByTestId } = renderWithContext(<SignInScreen next={next} />);

    fireEvent.press(getByTestId('forgotPasswordButton'));
    await flushMicrotasksQueue();

    expect(authenticate).toHaveBeenCalledWith({
      provider: IdentityProvider.TheKey,
      theKeyOptions: {
        type: SignInWithTheKeyType.ForgotPassword,
      },
    });
  });
});
