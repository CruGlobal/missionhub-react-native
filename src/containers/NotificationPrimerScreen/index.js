import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Button, Flex } from '../../components/common';
import { requestNativePermissions } from '../../actions/notifications';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

import styles from './styles';

@translate('notificationPrimer')
class NotificationPrimerScreen extends Component {
  constructor(props) {
    super(props);

    this.allow = this.allow.bind(this);
    this.notNow = this.notNow.bind(this);
  }

  notNow() {
    this.props.onComplete();
    this.props.dispatch(trackActionWithoutData(ACTIONS.NOT_NOW));
  }

  async allow() {
    try {
      await this.props.dispatch(requestNativePermissions());
    } finally {
      this.props.onComplete();
    }
    this.props.dispatch(trackActionWithoutData(ACTIONS.ALLOW));
  }

  render() {
    const { t, descriptionText } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex value={0.3} />
        <Flex value={1} align="center" justify="center">
          <Flex value={1} align="center" justify="center">
            <Image
              source={require('../../../assets/images/notificationPrimer.png')}
            />
          </Flex>
          <Flex value={0.6} align="center" justify="center">
            <Text style={styles.text}>{descriptionText}</Text>
          </Flex>
          <Flex value={1} align="center" justify="center">
            <Button
              pill={true}
              type="primary"
              onPress={this.allow}
              text={t('allow').toUpperCase()}
              style={styles.allowButton}
              buttonTextStyle={styles.buttonText}
            />
            <Button
              pill={true}
              onPress={this.notNow}
              text={t('notNow').toUpperCase()}
              style={styles.notNowButton}
              buttonTextStyle={styles.buttonText}
            />
          </Flex>
        </Flex>
        <Flex value={0.3} />
      </Flex>
    );
  }
}

NotificationPrimerScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(NotificationPrimerScreen);
export const NOTIFICATION_PRIMER_SCREEN = 'nav/NOTIFICATION_PRIMER';
