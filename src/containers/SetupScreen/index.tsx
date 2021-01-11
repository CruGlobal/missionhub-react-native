import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Keyboard, TextInput, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useMutation } from '@apollo/react-hooks';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import appsFlyer from 'react-native-appsflyer';

import { Flex, Input, LoadingWheel } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import TosPrivacy from '../../components/TosPrivacy';
import DeprecatedBackButton from '../DeprecatedBackButton';
import Header from '../../components/Header';
import Skip from '../../components/Skip';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, LOAD_PERSON_DETAILS } from '../../constants';
import { personSelector } from '../../selectors/people';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { RootState } from '../../reducers';
import { useAuth } from '../../auth/useAuth';
import { useAuthPerson } from '../../auth/authHooks';
import { SignInWithAnonymousType } from '../../auth/providers/useSignInWithAnonymous';
import { getAuthPerson } from '../../auth/authUtilities';
import { AuthErrorNotice } from '../../auth/components/AuthErrorNotice/AuthErrorNotice';
import { IdentityProvider } from '../../auth/constants';

import { CREATE_PERSON, UPDATE_PERSON } from './queries';
import {
  CreatePersonVariables,
  CreatePerson,
} from './__generated__/CreatePerson';
import {
  UpdatePerson,
  UpdatePersonVariables,
} from './__generated__/UpdatePerson';
import styles from './styles';

interface SetupScreenProps {
  next: (props: {
    skip?: boolean;
    personId?: string;
  }) => ThunkAction<void, RootState, never, AnyAction>;
  isMe: boolean;
  hideSkipBtn?: boolean;
}

const SetupScreen = ({ next, isMe, hideSkipBtn = false }: SetupScreenProps) => {
  useAnalytics(['onboarding', `${isMe ? 'self' : 'contact'} name`]);
  const { t } = useTranslation('onboardingCreatePerson');
  const relationshipType: RelationshipTypeEnum = useNavigationParam(
    'relationshipType',
  );
  const dispatch = useDispatch();

  const onboardingPersonid = useSelector(
    ({ onboarding }: RootState) => onboarding.personId,
  );

  const { authenticate, loading: authLoading, error: authError } = useAuth();

  const {
    id: myId,
    firstName: myFirstName,
    lastName: myLastName,
  } = useAuthPerson();

  const personId = isMe ? myId : onboardingPersonid;

  const {
    first_name: personFirstName,
    last_name: personLastName,
  } = useSelector(
    (state: RootState) => personSelector(state, { personId }) || {},
  );

  const [firstName, setFirstName] = useState(
    isMe ? myFirstName : personFirstName,
  );
  const [lastName, setLastName] = useState(isMe ? myLastName : personLastName);
  const [isLoading, setIsLoading] = useState(false);
  const lastNameRef = useRef<TextInput>(null);

  const [createPerson, { error: createError }] = useMutation<
    CreatePerson,
    CreatePersonVariables
  >(CREATE_PERSON);

  const [updatePerson, { error: updateError }] = useMutation<
    UpdatePerson,
    UpdatePersonVariables
  >(UPDATE_PERSON);

  const handleBack = useLogoutOnBack(true, !!personId);

  const saveAndNavigateNext = async () => {
    Keyboard.dismiss();
    if (!firstName) {
      return;
    }
    try {
      setIsLoading(true);
      if (personId) {
        const { data } = await updatePerson({
          variables: {
            input: {
              id: personId,
              firstName,
              lastName,
              relationshipType,
            },
          },
        });
        data?.updatePerson?.person &&
          dispatch({
            type: LOAD_PERSON_DETAILS,
            person: {
              first_name: data?.updatePerson?.person.firstName,
              id: data?.updatePerson?.person.id,
            },
          });
        dispatch(next({ personId }));
      } else if (isMe) {
        try {
          await authenticate({
            provider: IdentityProvider.Anonymous,
            anonymousOptions: {
              type: SignInWithAnonymousType.Create,
              firstName,
              lastName,
            },
          });
          dispatch(next({ personId: getAuthPerson().id }));
        } catch {}
      } else {
        const { data } = await createPerson({
          variables: {
            input: {
              firstName,
              lastName,
              relationshipType,
              assignToMe: true,
            },
          },
        });

        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
        appsFlyer.trackEvent(ACTIONS.PERSON_ADDED.name, ACTIONS.PERSON_ADDED);
        data?.createPerson?.person &&
          dispatch({
            type: LOAD_PERSON_DETAILS,
            person: {
              first_name: data?.createPerson?.person.firstName,
              id: data?.createPerson?.person.id,
            },
          });
        data?.createPerson?.person &&
          dispatch(next({ personId: data?.createPerson?.person.id }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onFirstNameSubmitEditing = () =>
    lastNameRef.current && lastNameRef.current.focus();

  const skip = () => {
    dispatch(next({ skip: true }));
  };

  return (
    <View style={styles.container}>
      <ErrorNotice
        error={createError}
        message={t('errorSavingPerson')}
        refetch={saveAndNavigateNext}
      />
      <ErrorNotice
        error={updateError}
        message={t('errorSavingPerson')}
        refetch={saveAndNavigateNext}
      />
      <AuthErrorNotice error={authError} />
      <Header
        left={
          <DeprecatedBackButton
            customNavigate={isMe ? handleBack : undefined}
          />
        }
        right={isMe || hideSkipBtn ? null : <Skip onSkip={skip} />}
      />
      <Flex value={2} justify="end" align="center">
        {isMe ? (
          <Text style={styles.header}>{t('namePrompt')}</Text>
        ) : (
          <>
            <View style={styles.textWrap}>
              <Text style={styles.addPersonText}>{t('addPerson')}</Text>
            </View>
          </>
        )}
      </Flex>
      <View style={styles.inputWrap}>
        <View>
          <Text style={styles.label}>
            {isMe
              ? t('profileLabels.firstNameRequired')
              : t('profileLabels.firstNameNickname')}
          </Text>
          <Input
            onChangeText={(firstName: string) => setFirstName(firstName)}
            value={firstName}
            autoFocus={true}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={onFirstNameSubmitEditing}
            placeholder={t('profileLabels.firstName')}
            placeholderTextColor="white"
            testID="InputFirstName"
          />
        </View>
        <View style={{ paddingVertical: 30 }}>
          <Input
            ref={lastNameRef}
            onChangeText={(lastName: string) => setLastName(lastName)}
            value={lastName}
            returnKeyType="done"
            placeholder={
              isMe
                ? t('profileLabels.lastName')
                : t('profileLabels.lastNameOptional')
            }
            placeholderTextColor="white"
            blurOnSubmit={true}
            onSubmitEditing={saveAndNavigateNext}
            testID="InputLastName"
          />
        </View>
        {isMe ? <TosPrivacy trial={true} /> : null}
      </View>
      <BottomButton
        testID="SaveBottomButton"
        disabled={isLoading || !firstName}
        onPress={saveAndNavigateNext}
        text={t('continue')}
      />
      {authLoading ? <LoadingWheel /> : null}
    </View>
  );
};

export default SetupScreen;
export const SETUP_SCREEN = 'nav/SETUP';
export const SETUP_PERSON_SCREEN = 'nav/SETUP_PERSON_SCREEN';
