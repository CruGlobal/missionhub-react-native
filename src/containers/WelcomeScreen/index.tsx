import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { Flex, Text, Button } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import Header from '../../components/Header';
import BackButton from '../BackButton';
import TrackOnFocus from '../TrackOnFocus';

import styles from './styles';

const WelcomeScreen = ({
  dispatch,
  next,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (params: { signin: boolean }) => ThunkAction<void, any, null, never>;
}) => {
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
      <TrackOnFocus screenNameFragments={['onboarding', 'welcome']} />
      <Header left={<BackButton />} />
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

export default connect()(WelcomeScreen);
export const WELCOME_SCREEN = 'nav/WELCOME';
