import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Keyboard, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { Text, Flex, Input } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import {
  createMyPerson,
  firstNameChanged,
  lastNameChanged,
} from '../../actions/onboardingProfile';
import TosPrivacy from '../../components/TosPrivacy';
import { ProfileState } from '../../reducers/profile';
import { AuthState } from '../../reducers/auth';
import { updatePerson } from '../../actions/person';
import { BackButton } from '../BackButton';
import { prompt } from '../../utils/prompt';
import { logout } from '../../actions/auth/auth';
import { navigateBack } from '../../actions/navigation';

import styles from './styles';

interface SetupScreenProps {
  next: () => ThunkAction<unknown, {}, {}, AnyAction>;
  firstName?: string;
  lastName?: string;
  personId?: string;
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const SetupScreen = ({
  dispatch,
  next,
  firstName,
  lastName,
  personId,
}: SetupScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('setup');
  const lastNameRef = useRef<TextInput>(null);

  const saveAndGoToGetStarted = async () => {
    Keyboard.dismiss();
    if (!firstName) {
      return;
    }
    try {
      setIsLoading(true);
      if (personId) {
        await dispatch(
          updatePerson({
            id: personId,
            firstName,
            lastName,
          }),
        );
        dispatch(next());
      } else {
        await dispatch(createMyPerson(firstName, lastName));
        dispatch(next());
      }
    } finally {
      setIsLoading(false);
    }
  };
  const updateFirstName = (t: string) => dispatch(firstNameChanged(t));
  const updateLastName = (t: string) => dispatch(lastNameChanged(t));
  const onFirstNameSubmitEditing = () =>
    lastNameRef.current && lastNameRef.current.focus();

  const handleBack = () => {
    // When id exists, try to logout
    if (personId) {
      prompt({
        title: t('goBackAlert.title'),
        description: t('goBackAlert.description'),
        actionLabel: t('goBackAlert.action'),
      }).then(isLoggingOut => {
        if (isLoggingOut) {
          dispatch(logout());
        }
      });
    } else {
      dispatch(navigateBack());
    }
    return true;
  };
  return (
    <SafeAreaView style={styles.container}>
      <Flex value={2} justify="end" align="center">
        <Text header={true} style={styles.header}>
          {t('namePrompt')}
        </Text>
      </Flex>

      <Flex value={3} style={{ padding: 30 }}>
        <View>
          <Text style={styles.label}>
            {t('profileLabels.firstNameRequired')}
          </Text>
          <Input
            onChangeText={updateFirstName}
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
            onChangeText={updateLastName}
            value={lastName}
            returnKeyType="done"
            placeholder={t('profileLabels.lastName')}
            placeholderTextColor="white"
            blurOnSubmit={true}
            onSubmitEditing={saveAndGoToGetStarted}
            testID="InputLastName"
          />
        </View>
        <TosPrivacy trial={true} />
      </Flex>
      <BottomButton
        testID="SaveBottomButton"
        disabled={isLoading}
        onPress={saveAndGoToGetStarted}
        text={t('next')}
      />
      <AndroidBackHandler onBackPress={handleBack} />
      <BackButton
        absolute={true}
        customNavigate={handleBack}
        testID="BackButton"
      />
    </SafeAreaView>
  );
};
const mapStateToProps = ({
  auth,
  profile,
}: {
  auth: AuthState;
  profile: ProfileState;
}) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  personId: auth.person.id,
});
export default connect(mapStateToProps)(SetupScreen);
export const SETUP_SCREEN = 'nav/SETUP';
