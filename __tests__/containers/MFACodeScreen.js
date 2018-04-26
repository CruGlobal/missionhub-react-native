import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../testUtils';
import MFACodeScreen from '../../src/containers/MFACodeScreen';
import { keyLogin } from '../../src/actions/auth';
import { MFA_REQUIRED } from '../../src/constants';

jest.mock('../../src/actions/auth');

const mockStore = configureStore([ thunk ]);
const store = mockStore({});

const email = 'roger@test.com';
const password = 'my password';
const upgradeAccount = true;

const navigation = {
  state: {
    params: {
      email, password, upgradeAccount,
    },
  },
};

let screen;

beforeEach(() => {
  screen = renderShallow(
    <MFACodeScreen navigation={navigation} />,
    store
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('login button is clicked', () => {
  const clickLoginButton = () => screen.childAt(0).childAt(3).props().onPress();

  it('logs in with email, password, mfa code, and upgrade account', async() => {
    const mockKeyLoginResult = { type: 'logged in with the Key' };
    keyLogin.mockReturnValue(mockKeyLoginResult);

    await clickLoginButton();

    expect(store.getActions()).toEqual([ mockKeyLoginResult ]);
  });

  it('shows error modal if mfa code is incorrect', async() => {
    keyLogin.mockReturnValue(() => Promise.reject({ apiError: { thekey_authn_error: MFA_REQUIRED } }));

    await clickLoginButton();

    screen.update();
    expect(screen).toMatchSnapshot();
  });
});

