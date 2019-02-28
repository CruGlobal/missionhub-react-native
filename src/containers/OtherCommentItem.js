import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Text, Touchable } from '../common';
import CardTime from '../CardTime';
import CelebrateItemName from '../../containers/CelebrateItemName';

import styles from './styles';

export default class OtherCommentItem extends Component {
  // eslint-disable-next-line
  handleReport = item => {
    // TODO: Report comment
  };

  handleLongPress = (item, componentRef) => {
    const {
      event: { organization },
      me,
    } = this.props;

    showMenu(
      [
        {
          text: i18n.t('report'),
          onPress: () => this.handleReport(item),
          destructive: true,
        },
      ],
      componentRef,
    );
  };

  render() {
    return <CommentItem onLongPress={this.handleLongPress} />;
  }
}
