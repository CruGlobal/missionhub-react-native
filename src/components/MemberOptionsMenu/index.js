import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Share, Linking } from 'react-native';
import { translate } from 'react-i18next';

import PopupMenu from '../PopupMenu';
import { getSurveyUrl } from '../../utils/common';

@translate('groupMemberOptions')
class MemberOptionsMenu extends Component {
  makeAdmin = () => {
    console.log('Make Admin');
  };

  makeOwner = () => {
    console.log('Make Owner');
  };

  removeMember = () => {
    console.log('Remove Member');
  };

  render() {
    const { t, header } = this.props;
    const props = {
      actions: [
        { text: t('makeAdmin'), onPress: this.makeAdmin },
        { text: t('makeOwner'), onPress: this.makeOwner },
        { text: t('removeMember'), onPress: this.removeMember },
      ],
      iconProps: {},
    };
    return <PopupMenu {...props} />;
  }
}

export default MemberOptionsMenu;
