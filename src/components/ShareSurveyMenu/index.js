import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Share, Linking } from 'react-native';
import { translate } from 'react-i18next';

import PopupMenu from '../PopupMenu';
import { getSurveyUrl } from '../../utils/common';

import styles from './styles';

@translate('shareSurveyMenu')
class ShareSurveyMenu extends Component {
  takeSurvey = () => {
    Linking.openURL(getSurveyUrl(this.props.survey.id));
  };

  shareSurvey = () => {
    const { t, survey } = this.props;
    const url = getSurveyUrl(survey.id);
    const shareMessage = t('shareMessage', { name: survey.title, url });
    Share.share({ message: shareMessage });
  };

  render() {
    const { t, header } = this.props;
    let props = {
      actions: [
        { text: t('shareSurvey'), onPress: this.shareSurvey },
        { text: t('takeSurvey'), onPress: this.takeSurvey },
      ],
      iconProps: {},
    };
    if (header) {
      props.iconProps.style = styles.headerIcon;
    }
    return <PopupMenu {...props} />;
  }
}

ShareSurveyMenu.propTypes = {
  survey: PropTypes.object.isRequired,
  header: PropTypes.bool,
};

export default ShareSurveyMenu;
