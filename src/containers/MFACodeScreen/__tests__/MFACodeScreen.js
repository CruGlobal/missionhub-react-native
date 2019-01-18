import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Alert } from 'react-native';
import i18n from 'i18next';

import { renderShallow } from '../../../../testUtils';

import MFACodeScreen from '..';

import { keyLogin } from '../../../actions/auth';
import { MFA_REQUIRED } from '../../../constants';

jest.mock('../../../actions/auth');

const mockStore = configureStore([thunk]);
const store = mockStore({});

const email = 'roger@test.com';
const password = 'my password';
const upgradeAccount = true;

const navigation = {
  state: {
    params: {
      email,
      password,
      upgradeAccount,
    },
  },
};

let screen;

beforeEach(() => {
  screen = renderShallow(<MFACodeScreen navigation={navigation} />, store);
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

  it('logs in with email, password, mfa code, and upgrade account', async () => {
    const mockKeyLoginResult = { type: 'logged in with the Key' };
    keyLogin.mockReturnValue(mockKeyLoginResult);

    await clickLoginButton();

    expect(store.getActions()).toEqual([mockKeyLoginResult]);
  });

  it('shows error modal if mfa code is incorrect', async () => {
    Alert.alert = jest.fn();
    keyLogin.mockReturnValue(() =>
      Promise.reject({ apiError: { thekey_authn_error: MFA_REQUIRED } }),
    );

    await clickLoginButton();

    expect(Alert.alert).toHaveBeenCalledWith(i18n.t('mfaLogin:mfaIncorrect'));
  });

  it('it throws unexpected errors', async () => {
    expect.assertions(1);
    const error = { apiError: { message: 'some error' } };
    keyLogin.mockReturnValue(() => Promise.reject(error));

    try {
      await clickLoginButton();
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it('changes loading property', () => {
    //this test is synchronous on purpose 😁
    clickLoginButton();

    screen.update();
    expect(screen).toMatchSnapshot();
  });
});
