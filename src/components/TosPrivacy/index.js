import React, { Component } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Button, Flex, Text } from '../common';
import { LINKS } from '../../constants';

import styles from './styles';

@translate()
class TosPrivacy extends Component {
  openTermsLink = () => Linking.openURL(LINKS.terms);
  openPrivacyLink = () => Linking.openURL(LINKS.privacy);

  render() {
    const { t, flexProps, trial } = this.props;

    return (
      <Flex direction="column" style={styles.termsWrap} {...flexProps}>
        <Text style={styles.termsText}>
          {t(trial ? 'termsTrial' : 'terms')}
        </Text>
        <Flex direction="row" align="center" justify="center">
          <Button
            text={t('tos')}
            type="transparent"
            onPress={this.openTermsLink}
            buttonTextStyle={styles.termsTextLink}
          />
          <Text style={styles.termsText}>{t('and')}</Text>
          <Button
            text={t('privacy')}
            type="transparent"
            onPress={this.openPrivacyLink}
            buttonTextStyle={styles.termsTextLink}
          />
        </Flex>
      </Flex>
    );
  }
}

TosPrivacy.propTypes = {
  flexProps: PropTypes.object,
};

export default TosPrivacy;
