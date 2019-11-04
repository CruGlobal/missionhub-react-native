import React from 'react';
import { Share, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import PopupMenu from '../PopupMenu';
import { getSurveyUrl } from '../../utils/common';

import styles from './styles';

interface ShareSurveyMenuProps {
  survey: { id: string; title: string };
  header?: boolean;
}

const ShareSurveyMenu = ({ survey, header }: ShareSurveyMenuProps) => {
  const { t } = useTranslation('shareSurveyMenu');
  const takeSurvey = () => {
    Linking.openURL(getSurveyUrl(survey.id));
  };
  const shareSurvey = () => {
    const url = getSurveyUrl(survey.id);
    const shareMessage = t('shareMessage', { name: survey.title, url });
    Share.share({ message: shareMessage });
  };
  const props = {
    actions: [
      { text: t('shareSurvey'), onPress: shareSurvey },
      { text: t('takeSurvey'), onPress: takeSurvey },
    ],
    ...(header ? { iconProps: { style: styles.headerIcon } } : {}),
  };
  return <PopupMenu testID="ShareSurveyMenu" {...props} />;
};

export default ShareSurveyMenu;
