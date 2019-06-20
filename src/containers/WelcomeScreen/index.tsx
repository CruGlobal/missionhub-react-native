import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import PropTypes from 'prop-types';

import { Flex, Text, Button } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { disableBack } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

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
    disableBack.add();

    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
    return () => disableBack.remove();
  }, []);

  const navigateToNext = (signin = false) => {
    // Remove the back handler when moving forward
    disableBack.remove();

    dispatch(next({ signin }));
  };

  const signIn = () => {
    navigateToNext(true);
  };

  const allowSignIn = useNavigationParam('allowSignIn');
  const { t } = useTranslation('welcome');

  return (
    <SafeAreaView style={styles.container}>
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
            text={t('getStarted')}
          />
        )}
      </Flex>
    </SafeAreaView>
  );
};

AddSomeoneScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect()(WelcomeScreen);
export const WELCOME_SCREEN = 'nav/WELCOME';
