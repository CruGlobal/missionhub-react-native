import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Alert } from 'react-native';
import i18n from 'i18next';

import { renderShallow } from '../../../../../testUtils';

import MFACodeScreen from '..';

import { keyLogin } from '../../../../actions/auth/key';
import { MFA_REQUIRED } from '../../../../constants';

jest.mock('../../../../actions/auth/key');

const mockStore = configureStore([thunk]);
const store = mockStore({});

const email = 'roger@test.com';
const password = 'my password';
const mfaCode = '123456';

const navigation = {
  state: {
    params: {
      email,
      password,
    },
  },
};

const nextAction = { type: 'test-next' };
const next = jest.fn(() => nextAction);

let screen;

beforeEach(() => {
  screen = renderShallow(
    <MFACodeScreen navigation={navigation} next={next} />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

it('changes text', () => {
  screen.props().onChangeText('new text');

  screen.update();
  expect(screen).toMatchSnapshot();
});

describe('onSubmit', () => {
  const clickLoginButton = () => screen.props().onSubmit();
  beforeEach(() => screen.setState({ mfaCode }));

  it('logs in with email, password, mfa code, and upgrade account', async () => {
    const mockKeyLoginResult = { type: 'logged in with the Key' };
    keyLogin.mockReturnValue(mockKeyLoginResult);

    await clickLoginButton();

    expect(keyLogin).toHaveBeenCalledWith(email, password, mfaCode);
    expect(next).toHaveBeenCalled();
    expect(store.getActions()).toEqual([mockKeyLoginResult, nextAction]);
  });

  it('shows error modal if mfa code is incorrect', async () => {
    Alert.alert = jest.fn();
    keyLogin.mockReturnValue(() =>
      Promise.reject({ apiError: { thekey_authn_error: MFA_REQUIRED } }),
    );

    await expect(clickLoginButton()).resolves.toBeUndefined();

    expect(keyLogin).toHaveBeenCalledWith(email, password, mfaCode);
    expect(next).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(i18n.t('mfaLogin:mfaIncorrect'));
  });

  it('it throws unexpected errors', async () => {
    const error = { apiError: { message: 'some error' } };
    keyLogin.mockReturnValue(() => Promise.reject(error));

    await expect(clickLoginButton()).rejects.toEqual(error);

    expect(keyLogin).toHaveBeenCalledWith(email, password, mfaCode);
    expect(next).not.toHaveBeenCalled();
  });

  it('changes loading property', () => {
    //this test is synchronous on purpose 😁
    clickLoginButton();

    screen.update();
    expect(screen).toMatchSnapshot();
  });
});
