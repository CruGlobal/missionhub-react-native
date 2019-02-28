import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Text, Touchable } from '../common';
import CardTime from '../CardTime';
import CelebrateItemName from '../../containers/CelebrateItemName';

import styles from './styles';

export default class AdminCommentItem extends Component {
  // eslint-disable-next-line
  handleDelete = item => {
    // TODO: Delete comment
  };

  handleLongPress = (item, componentRef) => {
    const {
      event: { organization },
      me,
    } = this.props;

    showMenu(
      [
        {
          text: i18n.t('delete'),
          onPress: () => this.handleDelete(item),
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
