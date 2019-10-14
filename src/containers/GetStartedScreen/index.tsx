import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { logout } from '../../actions/auth/auth';
import { navigateBack } from '../../actions/navigation';
import { Flex, Text } from '../../components/common';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';
import { prompt } from '../../utils/prompt';
import { ProfileState } from '../../reducers/profile';
import Header from '../../components/Header';

import styles from './styles';

interface GetStartedScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (props: { id: string | null }) => ThunkAction<void, any, null, never>;
  id: string | null;
  name: string;
  enableBackButton?: boolean;
  logoutOnBack?: boolean;
}

const GetStartedScreen = ({
  dispatch,
  next,
  id,
  name = '',
  enableBackButton = true,
  logoutOnBack = false,
}: GetStartedScreenProps) => {
  const { t } = useTranslation('getStarted');

  const back = () => {
    if (logoutOnBack) {
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

  useAndroidBackButton(enableBackButton, back);

  const navigateNext = () => {
    dispatch(next({ id }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        left={
          enableBackButton || logoutOnBack ? (
            <BackButton customNavigate={back} />
          ) : null
        }
      />
      <Flex align="center" justify="center" value={1} style={styles.content}>
        <Flex align="start" justify="center" value={4}>
          <Text header={true} style={styles.headerTitle}>
            {t('hi', { name: name.toLowerCase() })}
          </Text>
          <Text style={styles.text}>
            {t('tagline', { returnObjects: true })}
          </Text>
        </Flex>
        <BottomButton onPress={navigateNext} text={t('getStarted')} />
      </Flex>
    </SafeAreaView>
  );
};

const mapStateToProps = (
  { profile }: { profile: ProfileState },
  {
    navigation: {
      state: {
        params: { logoutOnBack },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => ({
  id: profile.id,
  name: profile.firstName,
  logoutOnBack,
});

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
