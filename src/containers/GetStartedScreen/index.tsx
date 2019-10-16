import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import { Flex, Text } from '../../components/common';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
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

  const handleBack = useLogoutOnBack(enableBackButton, logoutOnBack);

  const navigateNext = () => {
    dispatch(next({ id }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        left={handleBack ? <BackButton customNavigate={handleBack} /> : null}
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

const mapStateToProps = ({ profile }: { profile: ProfileState }) => ({
  id: profile.id,
  name: profile.firstName,
});

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
