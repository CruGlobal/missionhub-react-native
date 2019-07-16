import React from 'react';
import { Alert } from 'react-native';
import i18n from 'i18next';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { keyLogin } from '../../../../actions/auth/key';
import { MFA_REQUIRED } from '../../../../constants';

import MFACodeScreen from '..';

jest.mock('../../../../actions/auth/key');
jest.mock('../../../../components/MFACodeComponent', () => ({
  MFACodeComponent: 'MFACodeComponent',
}));

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

it('renders correctly', () => {
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
    const {
      recordSnapshot,
      getByTestId,
      store,
      diffSnapshot,
    } = renderWithContext(<MFACodeScreen next={next} />, renderConfig);

    fireEvent.changeText(getByTestId('MFACodeComponent'), mfaCode);
    recordSnapshot();

    const error = fireEvent(getByTestId('MFACodeComponent'), 'submit');
    await flushMicrotasksQueue();

    diffSnapshot();

    return {
      store,
      error,
    };
  };

  it('logs in with email, password, mfa code, and upgrade account', async () => {
    const mockKeyLoginResult = { type: 'logged in with the Key' };
    (keyLogin as jest.Mock).mockReturnValue(mockKeyLoginResult);

    const { store } = await clickLoginButton();

    expect(keyLogin).toHaveBeenCalledWith(email, password, mfaCode);
    expect(next).toHaveBeenCalled();
    expect(store.getActions()).toEqual([mockKeyLoginResult]);
  });

  it('shows error modal if mfa code is incorrect', async () => {
    Alert.alert = jest.fn();
    (keyLogin as jest.Mock).mockReturnValue(() =>
      Promise.reject({ apiError: { thekey_authn_error: MFA_REQUIRED } }),
    );

    await clickLoginButton();

    expect(keyLogin).toHaveBeenCalledWith(email, password, mfaCode);
    expect(next).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(i18n.t('mfaLogin:mfaIncorrect'));
  });

  it('it throws unexpected errors', async () => {
    const expectedError = { apiError: { message: 'some error' } };
    (keyLogin as jest.Mock).mockReturnValue(() =>
      Promise.reject(expectedError),
    );

    const { error } = await clickLoginButton();
    expect(error).rejects.toEqual(expectedError);

    expect(keyLogin).toHaveBeenCalledWith(email, password, mfaCode);
    expect(next).not.toHaveBeenCalled();
  });
});
