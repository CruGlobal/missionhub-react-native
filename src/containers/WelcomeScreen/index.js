import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { navigatePush } from '../../actions/navigation';
import theme from '../../theme';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import { SETUP_SCREEN } from '../SetupScreen';

@translate('welcome')
class WelcomeScreen extends Component {
  navigateToNext() {
    if (this.props.auth.isLoggedIn) {
      this.props.dispatch(navigatePush('GetStarted'));
    } else {
      this.props.dispatch(navigatePush(SETUP_SCREEN));
    }
  }

  render() {
    const { t } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex value={4} align="center" justify="center">
          <Text type="header" style={styles.headerText}>{t('welcome')}</Text>
          <Text style={styles.descriptionText}>{t('welcomeDescription')}</Text>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => this.navigateToNext()}
            text={t('ok').toUpperCase()}
            style={{ width: theme.fullWidth }}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth: auth,
});

export default connect(mapStateToProps)(WelcomeScreen);
export const WELCOME_SCREEN = 'nav/WELCOME';
