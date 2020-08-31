import { FetchPolicy } from 'apollo-client';

import { apolloClient } from '../apolloClient';
import {
  ANALYTICS_FACEBOOK_ID,
  ANALYTICS_SSO_GUID,
  ANALYTICS_GR_MASTER_PERSON_ID,
} from '../constants';
import { updateAnalyticsContext } from '../actions/analytics';

import { AUTH_PERSON } from './queries';
import {
  AuthPerson,
  AuthPerson_currentUser_person,
} from './__generated__/AuthPerson';
import { getAuthToken, isAuthenticated } from './authStore';
import { emptyAuthPerson } from './constants';

export const warmAuthCache = async () => {
  await getAuthToken();
  if (isAuthenticated()) {
    await loadAuthPerson('network-only');
  }
};

export const loadAuthPerson = async (fetchPolicy: FetchPolicy) => {
  const { data } = await apolloClient.query<AuthPerson>({
    query: AUTH_PERSON,
    fetchPolicy,
  });
  const { person } = data.currentUser;
  const { globalRegistryMdmId, theKeyUid, fbUid } = person;

  // Prevents circular dependency from breaking tests
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../store').store.dispatch(
    updateAnalyticsContext({
      [ANALYTICS_GR_MASTER_PERSON_ID]: globalRegistryMdmId ?? undefined,
      [ANALYTICS_SSO_GUID]: theKeyUid ?? undefined,
      [ANALYTICS_FACEBOOK_ID]: fbUid ?? undefined,
    }),
  );

  return person;
};

export const getAuthPerson = (): AuthPerson_currentUser_person => {
  try {
    const data = apolloClient.readQuery<AuthPerson>({
      query: AUTH_PERSON,
    });
    return data?.currentUser.person ?? emptyAuthPerson;
  } catch {}
  return emptyAuthPerson;
};
