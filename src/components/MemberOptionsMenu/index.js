import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Share, Linking } from 'react-native';
import { translate } from 'react-i18next';

import PopupMenu from '../PopupMenu';
import { getSurveyUrl } from '../../utils/common';

import styles from './styles';

@translate('shareSurveyMenu')
class MemberOptionsMenu extends Component {
  takeSurvey = () => {};

  shareSurvey = () => {};

  render() {
    const { t, header } = this.props;
    const props = {
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

MemberOptionsMenu.propTypes = {
  header: PropTypes.bool,
};

export default MemberOptionsMenu;
