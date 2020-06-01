import React, { useEffect } from 'react';
import { connect } from 'react-redux-legacy';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { Flex, Text, Button } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import {
  trackActionWithoutData,
  TrackStateContext,
} from '../../actions/analytics';
import { getAnalyticsSectionType } from '../../utils/analytics';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { ACTIONS, ANALYTICS_SECTION_TYPE } from '../../constants';
import Header from '../../components/Header';
import DeprecatedBackButton from '../DeprecatedBackButton';
import { OnboardingState } from '../../reducers/onboarding';

import styles from './styles';

interface WelcomeScreenProps {
  dispatch: ThunkDispatch<{}, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (params: { signin: boolean }) => ThunkAction<void, any, null, never>;
  analyticsSection: TrackStateContext[typeof ANALYTICS_SECTION_TYPE];
}

const WelcomeScreen = ({
  dispatch,
  next,
  analyticsSection,
}: WelcomeScreenProps) => {
  useAnalytics(['onboarding', 'welcome'], {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: analyticsSection,
    },
  });

  useEffect(() => {
    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
  }, [dispatch]);

  const navigateToNext = (signin = false) => {
    dispatch(next({ signin }));
  };

  const signIn = () => {
    navigateToNext(true);
  };

  const allowSignIn = useNavigationParam('allowSignIn');
  const { t } = useTranslation('welcome');

  return (
    <View style={styles.container}>
      <Header left={<DeprecatedBackButton />} />
      <Flex align="center" justify="center" value={1} style={styles.content}>
        <Flex value={3} align="start" justify="center">
          <Text header={true} style={styles.headerText}>
            {t('welcome')}
          </Text>
          <Text style={styles.descriptionText}>{t('welcomeDescription')}</Text>
        </Flex>

        {allowSignIn ? (
          <Flex value={1} align="center" justify="start">
            <Button
              testID="sign-in"
              pill={true}
              onPress={signIn}
              style={styles.filledButton}
              buttonTextStyle={styles.buttonText}
              text={t('signIn').toUpperCase()}
            />
            <Button
              testID="get-started-sign-in-variant"
              pill={true}
              onPress={navigateToNext}
              style={styles.clearButton}
              buttonTextStyle={styles.buttonText}
              text={t('getStartedButton').toUpperCase()}
            />
          </Flex>
        ) : (
          <BottomButton
            testID={'get-started'}
            onPress={navigateToNext}
            text={t('continue')}
          />
        )}
      </Flex>
    </View>
  );
};

const mapStateToProps = ({ onboarding }: { onboarding: OnboardingState }) => ({
  analyticsSection: getAnalyticsSectionType(onboarding),
});

export default connect(mapStateToProps)(WelcomeScreen);
export const WELCOME_SCREEN = 'nav/WELCOME';
