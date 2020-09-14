import { Linking } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import Config from 'react-native-config';

import { renderHookWithContext } from '../../../../testUtils';
import {
  setAuthToken,
  getAnonymousUid,
  deleteAnonymousUid,
  setTheKeyRefreshToken,
  getTheKeyRefreshToken,
} from '../../authStore';
import {
  useSignInWithTheKey,
  SignInWithTheKeyType,
} from '../useSignInWithTheKey';
import { REQUESTS } from '../../../api/routes';
import callApi from '../../../actions/api';
import { SIGN_IN_WITH_THE_KEY_MUTATION } from '../queries';

jest.mock('../../authStore');
jest.mock('../../../actions/api');
jest.mock('random-string', () => ({
  __esModule: true,
  default: () => '12345678901234567890123456789012345678901234567890',
}));
jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    THE_KEY_URL: 'https://thekey.me/cas/',
    THE_KEY_CLIENT_ID: 'testTheKeyClientId',
  },
}));

const token = 'test access token';
const anonymousUid = 'test anonymous user id';

const email = 'klas&jflk@lkjasdf.com';
const password = 'this&is=unsafe';
const mfaCode = '123456';
const theKeyAccessToken = 'test The Key access token';
const ticket = 'nfnvjvkfkfj886';
const refreshToken = 'khjdsfkksadjhsladjjldsvajdscandjehrwewrqr';
const code = 'test-code';
const redirectUri = 'https://missionhub.com/auth';

beforeEach(() => {
  (getAnonymousUid as jest.Mock).mockResolvedValue(anonymousUid);
});

it('should sign in wih The Key', async () => {
  (callApi as jest.Mock)
    .mockReturnValueOnce({
      type: REQUESTS.KEY_LOGIN.SUCCESS,
      access_token: theKeyAccessToken,
      refresh_token: refreshToken,
    })
    .mockReturnValueOnce({
      type: REQUESTS.KEY_GET_TICKET.SUCCESS,
      ticket,
    });

  const { result } = renderHookWithContext(() => useSignInWithTheKey(), {
    mocks: {
      Mutation: () => ({
        loginWithTheKey: () => ({ token }),
      }),
    },
  });

  await result.current.signInWithTheKey({
    type: SignInWithTheKeyType.EmailPassword,
    email,
    password,
  });

  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_LOGIN,
    {},
    `grant_type=password&client_id=${
      Config.THE_KEY_CLIENT_ID
    }&scope=fullticket%20extended&username=${encodeURIComponent(
      email,
    )}&password=${encodeURIComponent(password)}`,
  );
  expect(setTheKeyRefreshToken).toHaveBeenCalledWith(refreshToken);
  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_GET_TICKET,
    { access_token: theKeyAccessToken },
    {},
  );
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_THE_KEY_MUTATION, {
    variables: {
      accessToken: ticket,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should sign in wih The Key providing an MFA code', async () => {
  (callApi as jest.Mock)
    .mockReturnValueOnce({
      type: REQUESTS.KEY_LOGIN.SUCCESS,
      access_token: theKeyAccessToken,
      refresh_token: refreshToken,
    })
    .mockReturnValueOnce({
      type: REQUESTS.KEY_GET_TICKET.SUCCESS,
      ticket,
    });

  const { result } = renderHookWithContext(() => useSignInWithTheKey(), {
    mocks: {
      Mutation: () => ({
        loginWithTheKey: () => ({ token }),
      }),
    },
  });

  await result.current.signInWithTheKey({
    type: SignInWithTheKeyType.EmailPassword,
    email,
    password,
    mfaCode,
  });

  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_LOGIN,
    {},
    `grant_type=password&client_id=${
      Config.THE_KEY_CLIENT_ID
    }&scope=fullticket%20extended&username=${encodeURIComponent(
      email,
    )}&password=${encodeURIComponent(password)}&thekey_mfa_token=${mfaCode}`,
  );
  expect(setTheKeyRefreshToken).toHaveBeenCalledWith(refreshToken);
  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_GET_TICKET,
    { access_token: theKeyAccessToken },
    {},
  );
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_THE_KEY_MUTATION, {
    variables: {
      accessToken: ticket,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should refresh The Key auth', async () => {
  (getTheKeyRefreshToken as jest.Mock).mockResolvedValue(refreshToken);

  (callApi as jest.Mock)
    .mockReturnValueOnce({
      type: REQUESTS.KEY_REFRESH_TOKEN.SUCCESS,
      access_token: theKeyAccessToken,
      refresh_token: refreshToken,
    })
    .mockReturnValueOnce({
      type: REQUESTS.KEY_GET_TICKET.SUCCESS,
      ticket,
    });

  const { result } = renderHookWithContext(() => useSignInWithTheKey(), {
    mocks: {
      Mutation: () => ({
        loginWithTheKey: () => ({ token }),
      }),
    },
  });

  await result.current.signInWithTheKey({
    type: SignInWithTheKeyType.Refresh,
  });

  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_REFRESH_TOKEN,
    {},
    `grant_type=refresh_token&refresh_token=${refreshToken}`,
  );
  expect(setTheKeyRefreshToken).toHaveBeenCalledWith(refreshToken);
  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_GET_TICKET,
    { access_token: theKeyAccessToken },
    {},
  );
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_THE_KEY_MUTATION, {
    variables: {
      accessToken: ticket,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should sign up with The Key', async () => {
  (Linking.addEventListener as jest.Mock).mockImplementation(
    (_: 'url', onLinkBack) => {
      onLinkBack({ url: `${redirectUri}?code=${code}` });
    },
  );

  (callApi as jest.Mock)
    .mockReturnValueOnce({
      type: REQUESTS.KEY_LOGIN.SUCCESS,
      access_token: theKeyAccessToken,
      refresh_token: refreshToken,
    })
    .mockReturnValueOnce({
      type: REQUESTS.KEY_GET_TICKET.SUCCESS,
      ticket,
    });

  const { result } = renderHookWithContext(() => useSignInWithTheKey(), {
    mocks: {
      Mutation: () => ({
        loginWithTheKey: () => ({ token }),
      }),
    },
  });

  await result.current.signInWithTheKey({
    type: SignInWithTheKeyType.SignUp,
  });

  expect(Linking.openURL).toHaveBeenCalledWith(
    `${Config.THE_KEY_URL}login?action=signup&client_id=${Config.THE_KEY_CLIENT_ID}&response_type=code&redirect_uri=https://missionhub.com/auth&scope=fullticket%20extended&code_challenge_method=S256&code_challenge=cCKis6m4FKRN6dlJo9sJ4irCXlleTp7Sf1JRqvlVcn8`,
  );
  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_LOGIN,
    {},
    `grant_type=authorization_code&client_id=${Config.THE_KEY_CLIENT_ID}&code=${code}&code_verifier=MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTA&redirect_uri=${redirectUri}`,
  );
  expect(setTheKeyRefreshToken).toHaveBeenCalledWith(refreshToken);
  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_GET_TICKET,
    { access_token: theKeyAccessToken },
    {},
  );
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_THE_KEY_MUTATION, {
    variables: {
      accessToken: ticket,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should sign in after forgot password', async () => {
  (Linking.addEventListener as jest.Mock).mockImplementation(
    (_: 'url', onLinkBack) => {
      onLinkBack({ url: `${redirectUri}?code=${code}` });
    },
  );

  (callApi as jest.Mock)
    .mockReturnValueOnce({
      type: REQUESTS.KEY_LOGIN.SUCCESS,
      access_token: theKeyAccessToken,
      refresh_token: refreshToken,
    })
    .mockReturnValueOnce({
      type: REQUESTS.KEY_GET_TICKET.SUCCESS,
      ticket,
    });

  const { result } = renderHookWithContext(() => useSignInWithTheKey(), {
    mocks: {
      Mutation: () => ({
        loginWithTheKey: () => ({ token }),
      }),
    },
  });

  await result.current.signInWithTheKey({
    type: SignInWithTheKeyType.ForgotPassword,
  });

  expect(Linking.openURL).toHaveBeenCalledWith(
    `${Config.THE_KEY_URL}service/selfservice?target=displayForgotPassword&client_id=${Config.THE_KEY_CLIENT_ID}&response_type=code&redirect_uri=https://missionhub.com/auth&scope=fullticket%20extended&code_challenge_method=S256&code_challenge=cCKis6m4FKRN6dlJo9sJ4irCXlleTp7Sf1JRqvlVcn8`,
  );
  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_LOGIN,
    {},
    `grant_type=authorization_code&client_id=${Config.THE_KEY_CLIENT_ID}&code=${code}&code_verifier=MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTA&redirect_uri=${redirectUri}`,
  );
  expect(setTheKeyRefreshToken).toHaveBeenCalledWith(refreshToken);
  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.KEY_GET_TICKET,
    { access_token: theKeyAccessToken },
    {},
  );
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_THE_KEY_MUTATION, {
    variables: {
      accessToken: ticket,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});
