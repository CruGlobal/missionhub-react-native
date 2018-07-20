import React, { Component } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';

import { Text, Flex } from '../../components/common';
import HEARTS from '../../../assets/images/celebrateHearts.png';

import style from './styles';

@translate('celebrateFeeds')
export default class EmptyCelebrateFeed extends Component {
  renderDescription() {
    const { t, person } = this.props;

    let name = person ? person.first_name : t('emptyFeedGroupNameValue');
    name = name.concat(name.endsWith('s') ? "'" : "'s");

    return t('emptyFeedDescription', { firstName: name });
  }

  render() {
    const { t } = this.props;
    const { title, description, container } = style;

    return (
      <Flex style={container} align="center" justify="center" value={1}>
        <Image source={HEARTS} style={{ flexShrink: 1 }} resizeMode="contain" />
        <Text type="header" style={title}>
          {t('emptyFeedTitle')}
        </Text>
        <Text style={description}>{this.renderDescription()}</Text>
      </Flex>
    );
  }
}
