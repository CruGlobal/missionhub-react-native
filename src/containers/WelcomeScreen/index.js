import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import theme from '../../theme';
import { Flex, Text, Button } from '../../components/common';
import { SETUP_SCREEN } from '../SetupScreen';
import { disableBack } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

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

  navigateToNext = () => {
    const { dispatch, next } = this.props;

    // Remove the back handler when moving forward
    disableBack.remove();

    dispatch(next());
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
      </Flex>
    );
  }
}

WelcomeScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect()(WelcomeScreen);
export const WELCOME_SCREEN = 'nav/WELCOME';
