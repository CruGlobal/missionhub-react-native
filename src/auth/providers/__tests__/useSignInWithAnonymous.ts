import { useMutation } from '@apollo/react-hooks';

import { renderHookWithContext } from '../../../../testUtils';
import {
  useSignInWithAnonymous,
  SignInWithAnonymousType,
} from '../useSignInWithAnonymous';
import {
  SIGN_UP_WITH_ANONYMOUS_MUTATION,
  SIGN_IN_WITH_ANONYMOUS_MUTATION,
} from '../queries';
import {
  setAnonymousUid,
  setAuthToken,
  getAnonymousUid,
} from '../../authStore';
import { AuthError } from '../../constants';

jest.mock('../../authStore');

const firstName = 'Test Fname';
const lastName = 'Test Lname';
const token = 'test access token';
const anonymousUid = 'test anonymous user id';

beforeEach(() => {
  (getAnonymousUid as jest.Mock).mockResolvedValue(null);
});

it('should create new anonymous user', async () => {
  const { result } = renderHookWithContext(() => useSignInWithAnonymous(), {
    mocks: {
      Mutation: () => ({
        createAnonymousUser: () => ({ token, anonymousUid }),
      }),
    },
  });

  await result.current.signInWithAnonymous({
    type: SignInWithAnonymousType.Create,
    firstName,
    lastName,
  });

  expect(useMutation).toHaveBeenMutatedWith(SIGN_UP_WITH_ANONYMOUS_MUTATION, {
    variables: {
      firstName,
      lastName,
    },
  });
  expect(setAnonymousUid).toHaveBeenCalledWith(anonymousUid);
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should get a new access token using the refresh token', async () => {
  (getAnonymousUid as jest.Mock).mockResolvedValue(anonymousUid);

  const { result } = renderHookWithContext(() => useSignInWithAnonymous(), {
    mocks: {
      Mutation: () => ({
        loginWithAnonymous: () => ({ token }),
      }),
    },
  });

  await result.current.signInWithAnonymous({
    type: SignInWithAnonymousType.Refresh,
  });

  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_ANONYMOUS_MUTATION, {
    variables: { anonymousUid },
  });
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should handle missing token from API', async () => {
  const { result } = renderHookWithContext(() => useSignInWithAnonymous(), {
    mocks: {
      Mutation: () => ({
        createAnonymousUser: () => ({ token, anonymousUid: null }),
      }),
    },
  });

  await expect(
    result.current.signInWithAnonymous({
      type: SignInWithAnonymousType.Create,
      firstName,
      lastName,
    }),
  ).rejects.toEqual(AuthError.Unknown);

  expect(result.current.error).toEqual(AuthError.Unknown);

  expect(useMutation).toHaveBeenMutatedWith(SIGN_UP_WITH_ANONYMOUS_MUTATION, {
    variables: {
      firstName,
      lastName,
    },
  });
  expect(setAnonymousUid).not.toHaveBeenCalledWith(anonymousUid);
  expect(setAuthToken).not.toHaveBeenCalledWith(token);
});
