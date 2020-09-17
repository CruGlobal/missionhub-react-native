import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import MFACodeScreen from '..';
import { IdentityProvider, AuthError } from '../../../../auth/constants';
import { SignInWithTheKeyType } from '../../../../auth/providers/useSignInWithTheKey';
import { useAuth } from '../../../../auth/useAuth';

jest.mock('../../../../components/MFACodeComponent', () => ({
  MFACodeComponent: 'MFACodeComponent',
}));
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../auth/useAuth');
jest.mock('../../../../reducers/nav', () => null);

const authenticate = jest.fn();

const email = 'roger@test.com';
const password = 'my password';
const mfaCode = '123456';

const next = jest.fn(() => () => {});

const renderConfig = {
  navParams: {
    email,
    password,
  },
};

beforeEach(() => {
  (useAuth as jest.Mock).mockReturnValue({ authenticate });
});

it('renders correctly', () => {
  renderWithContext(<MFACodeScreen next={next} />, renderConfig).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['sign in', 'verification']);
});

it('renders loading and error', () => {
  (useAuth as jest.Mock).mockReturnValue({
    authenticate,
    loading: true,
    error: AuthError.Unknown,
  });
  renderWithContext(<MFACodeScreen next={next} />, renderConfig).snapshot();
});

it('changes text', () => {
  const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
    <MFACodeScreen next={next} />,
    renderConfig,
  );
  recordSnapshot();

  fireEvent.changeText(getByTestId('MFACodeComponent'), mfaCode);

  diffSnapshot();
});

describe('onSubmit', () => {
  const clickLoginButton = async () => {
    const { getByTestId } = renderWithContext(
      <MFACodeScreen next={next} />,
      renderConfig,
    );

    fireEvent.changeText(getByTestId('MFACodeComponent'), mfaCode);

    const error = fireEvent(getByTestId('MFACodeComponent'), 'submit');
    await flushMicrotasksQueue();

    return {
      error,
    };
  };

  it('logs in with email, password, mfa code, and upgrade account', async () => {
    await clickLoginButton();

    expect(authenticate).toHaveBeenCalledWith({
      provider: IdentityProvider.TheKey,
      theKeyOptions: {
        type: SignInWithTheKeyType.EmailPassword,
        email,
        password,
        mfaCode,
      },
    });
    expect(next).toHaveBeenCalled();
  });

  it("shouldn't navigate on error", async () => {
    authenticate.mockRejectedValue(AuthError.Unknown);

    await clickLoginButton();

    expect(authenticate).toHaveBeenCalledWith({
      provider: IdentityProvider.TheKey,
      theKeyOptions: {
        type: SignInWithTheKeyType.EmailPassword,
        email,
        password,
        mfaCode,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
