import React from 'react';
import { useDispatch } from 'react-redux';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Flex } from '../../components/common';
import DeprecatedBackButton from '../DeprecatedBackButton';
import BottomButton from '../../components/BottomButton';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import Header from '../../components/Header';
import { RootState } from '../../reducers';
import { useAuthPerson } from '../../auth/authHooks';

import styles from './styles';

interface GetStartedScreenProps {
  next: () => ThunkAction<void, RootState, never, AnyAction>;
  enableBackButton?: boolean;
  logoutOnBack?: boolean;
}

const GetStartedScreen = ({
  next,
  enableBackButton = true,
  logoutOnBack = false,
}: GetStartedScreenProps) => {
  useAnalytics(['onboarding', 'personal greeting'], { sectionType: true });
  const { t } = useTranslation('getStarted');
  const dispatch = useDispatch();

  const { firstName } = useAuthPerson();

  const handleBack = useLogoutOnBack(enableBackButton, logoutOnBack);

  const navigateNext = () => {
    dispatch(next());
  };

  return (
    <View style={styles.container}>
      <Header
        left={
          enableBackButton ? (
            <DeprecatedBackButton customNavigate={handleBack} />
          ) : null
        }
      />
      <Flex align="center" justify="center" value={1} style={styles.content}>
        <Flex align="start" justify="center" value={4}>
          <Text style={styles.headerTitle}>
            {t('hi', { name: firstName.toLowerCase() })}
          </Text>
          <Text style={styles.text}>
            {t('tagline', { returnObjects: true })}
          </Text>
        </Flex>
        <BottomButton onPress={navigateNext} text={t('continue')} />
      </Flex>
    </View>
  );
};

export default GetStartedScreen;
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
