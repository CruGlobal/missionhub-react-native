import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import theme from '../../theme';
import { Flex, Text, Button } from '../../components/common';
import { disableBack } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';

@translate('welcome')
class WelcomeScreen extends Component {
  componentDidMount() {
    disableBack.add();

    this.props.dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  navigateToNext = (signin = false) => {
    const { dispatch, next } = this.props;
    // Remove the back handler when moving forward
    disableBack.remove();

    dispatch(next({ signin }));
  };

  signIn = () => {
    this.navigateToNext(true);
  };

  render() {
    const { t, allowSignIn } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex value={3} align="start" justify="center">
          <Text type="header" style={styles.headerText}>
            {t('welcome')}
          </Text>
          <Text style={styles.descriptionText}>{t('welcomeDescription')}</Text>
        </Flex>

        {allowSignIn ? (
          <Flex value={1} align="center" justify="start">
            <Button
              name={'signIn'}
              pill={true}
              onPress={this.signIn}
              style={styles.filledButton}
              buttonTextStyle={styles.buttonText}
              text={t('signIn').toUpperCase()}
            />
            <Button
              name={'tryItNow'}
              pill={true}
              onPress={this.navigateToNext}
              style={styles.clearButton}
              buttonTextStyle={styles.buttonText}
              text={t('tryItNow').toUpperCase()}
            />
          </Flex>
        ) : (
          <Flex value={1} align="stretch" justify="end">
            <Button
              type="secondary"
              onPress={this.navigateToNext}
              text={t('getStarted').toUpperCase()}
              style={{ width: theme.fullWidth }}
            />
          </Flex>
        )}
      </Flex>
    );
  }
}

WelcomeScreen.propTypes = {
  next: PropTypes.func,
  allowSignIn: PropTypes.bool,
};

const mapStateToProps = (_, { navigation }) => {
  const { allowSignIn } = navigation.state.params || {};

  return {
    allowSignIn,
  };
};

export default connect(mapStateToProps)(WelcomeScreen);
export const WELCOME_SCREEN = 'nav/WELCOME';
