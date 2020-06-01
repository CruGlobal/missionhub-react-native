import React from 'react';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';

import { TrackStateContext } from '../../actions/analytics';
import { Flex, Text } from '../../components/common';
import DeprecatedBackButton from '../DeprecatedBackButton';
import BottomButton from '../../components/BottomButton';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { getAnalyticsSectionType } from '../../utils/analytics';
import { ANALYTICS_SECTION_TYPE } from '../../constants';
import Header from '../../components/Header';
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';

import styles from './styles';

interface GetStartedScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => ThunkAction<void, any, null, never>;
  analyticsSection: TrackStateContext[typeof ANALYTICS_SECTION_TYPE];
  name: string;
  enableBackButton?: boolean;
  logoutOnBack?: boolean;
}

const GetStartedScreen = ({
  next,
  analyticsSection,
  name = '',
  enableBackButton = true,
  logoutOnBack = false,
}: GetStartedScreenProps) => {
  useAnalytics(['onboarding', 'personal greeting'], {
    screenContext: { [ANALYTICS_SECTION_TYPE]: analyticsSection },
  });
  const { t } = useTranslation('getStarted');
  const dispatch = useDispatch();

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

const mapStateToProps = ({
  auth,
  onboarding,
}: {
  auth: AuthState;
  onboarding: OnboardingState;
}) => ({
  name: auth.person.first_name,
  analyticsSection: getAnalyticsSectionType(onboarding),
});

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
