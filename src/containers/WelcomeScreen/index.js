import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import theme from '../../theme';
import { Flex, Text, Button } from '../../components/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import BackButton from '../BackButton';
import { prompt } from '../../utils/prompt';
import { logout } from '../../actions/auth';

import styles from './styles';

@translate('welcome')
class WelcomeScreen extends Component {
  componentDidMount() {
    this.props.dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
  }

  navigateToNext = () => {
    const { dispatch, next } = this.props;

    dispatch(next({ isMe: true }));
  };

  handleBackAction = () => {
    this.promptToLogout();
    return true; // Don't perform normal back action
  };

  promptToLogout = async () => {
    const { dispatch, t } = this.props;
    if (
      await prompt({
        title: t('goBackAlert.title'),
        description: t('goBackAlert.description'),
        actionLabel: t('goBackAlert.action'),
      })
    ) {
      dispatch(logout());
    }
  };

  render() {
    const { t } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex value={4} align="start" justify="center">
          <Text type="header" style={styles.headerText}>
            {t('welcome')}
          </Text>
          <Text style={styles.descriptionText}>{t('welcomeDescription')}</Text>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.navigateToNext}
            text={t('ok').toUpperCase()}
            style={{ width: theme.fullWidth }}
          />
        </Flex>
        <BackButton absolute={true} customNavigate={this.handleBackAction} />
        <AndroidBackHandler onBackPress={this.handleBackAction} />
      </Flex>
    );
  }
}

WelcomeScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect()(WelcomeScreen);
export const WELCOME_SCREEN = 'nav/WELCOME';
