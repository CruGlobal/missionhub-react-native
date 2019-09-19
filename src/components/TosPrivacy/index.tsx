import React from 'react';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Text } from '../common';
import { LINKS } from '../../constants';
import { FlexProps } from '../Flex';

import styles from './styles';

interface TosPrivacyProps {
  flexProps?: FlexProps;
  trial?: boolean;
}

const TosPrivacy = ({ flexProps, trial }: TosPrivacyProps) => {
  const { t } = useTranslation();
  const openTermsLink = () => Linking.openURL(LINKS.terms);
  const openPrivacyLink = () => Linking.openURL(LINKS.privacy);

  return (
    <Flex direction="column" style={styles.termsWrap} {...flexProps}>
      <Text style={styles.termsText}>{t(trial ? 'termsTrial' : 'terms')}</Text>
      <Flex direction="row" align="center" justify="center">
        <Button
          testID="ToSButton"
          text={t('tos')}
          type="transparent"
          onPress={openTermsLink}
          buttonTextStyle={styles.termsTextLink}
        />
        <Text style={styles.termsText}>{t('and')}</Text>
        <Button
          testID="PrivacyButton"
          text={t('privacy')}
          type="transparent"
          onPress={openPrivacyLink}
          buttonTextStyle={styles.termsTextLink}
        />
      </Flex>
    </Flex>
  );
};

export default TosPrivacy;
