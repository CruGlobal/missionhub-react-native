import { useQuery } from '@apollo/react-hooks';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import appsFlyer from 'react-native-appsflyer';

import { logInAnalytics } from '../actions/analytics';
import { rollbar } from '../utils/rollbar.config';
import { getFeatureFlags } from '../actions/misc';
import { updateLocaleAndTimezone } from '../actions/auth/userData';
import { requestNativePermissions } from '../actions/notifications';
import { isAndroid } from '../utils/common';

import { getAnonymousUid, isAuthenticated } from './authStore';
import {
  AuthPerson,
  AuthPerson_currentUser_person,
} from './__generated__/AuthPerson';
import { AUTH_PERSON } from './queries';
import { loadAuthPerson } from './authUtilities';
import { emptyAuthPerson } from './constants';

export const useAuthPerson = (): AuthPerson_currentUser_person => {
  const { data } = useQuery<AuthPerson>(AUTH_PERSON, {
    fetchPolicy: 'cache-first',
    skip: !isAuthenticated(),
  });
  return data?.currentUser.person ?? emptyAuthPerson;
};

export const useIsAnonymousUser = (): boolean => {
  const [isAnonymousUser, setIsAnonymousUser] = useState(false);

  useEffect(() => {
    (async () => {
      setIsAnonymousUser(!!(await getAnonymousUid()));
    })();
  }, []);

  return isAnonymousUser;
};

export const useAuthSuccess = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const { id, globalRegistryMdmId } = await loadAuthPerson('network-only');

    dispatch(logInAnalytics());

    rollbar.setPerson(id);

    if (globalRegistryMdmId) {
      appsFlyer.setCustomerUserId(globalRegistryMdmId, () => {});
    }

    getFeatureFlags();
    dispatch(updateLocaleAndTimezone());

    isAndroid && dispatch(requestNativePermissions());
  }, []);
};
