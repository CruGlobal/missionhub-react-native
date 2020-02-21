import React from 'react';
import { connect } from 'react-redux-legacy';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { ANALYTICS_SECTION_TYPE } from '../../constants';
import { Flex, Text } from '../../components/common';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import Header from '../../components/Header';
import { AuthState } from '../../reducers/auth';

import styles from './styles';

interface GetStartedScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => ThunkAction<void, any, null, never>;
  name: string;
  enableBackButton?: boolean;
  logoutOnBack?: boolean;
}

const GetStartedScreen = ({
  dispatch,
  next,
  name = '',
  enableBackButton = true,
  logoutOnBack = false,
}: GetStartedScreenProps) => {
  useAnalytics({
    screenName: ['onboarding', 'personal greeting'],
    screenContext: { [ANALYTICS_SECTION_TYPE]: 'onboarding' },
  });
  const { t } = useTranslation('getStarted');

  const handleBack = useLogoutOnBack(enableBackButton, logoutOnBack);

  const navigateNext = () => {
    dispatch(next());
  };

  return (
    <View style={styles.container}>
      <Header
        left={
          enableBackButton ? <BackButton customNavigate={handleBack} /> : null
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
        <BottomButton onPress={navigateNext} text={t('continue')} />
      </Flex>
    </View>
  );
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  name: auth.person.first_name,
});

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
