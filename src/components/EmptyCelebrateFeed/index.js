import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { translate } from 'react-i18next';

import { Text, Flex } from '../../components/common';
import { isAppUser } from '../../utils/common';
import HEARTS from '../../../assets/images/celebrateHearts.png';
import style from './styles';

@translate('celebrateFeeds')
class EmptyCelebrateFeed extends Component {
  render() {
    const { t, person, isAppUser } = this.props;
    const { title, description, container } = style;

    let firstName = isAppUser ? t('your') : person.first_name;

    return (
      <Flex style={container} align="center" justify="center" value={1}>
        <Image source={HEARTS} style={{ flexShrink: 1 }} resizeMode="contain" />
        <Text type="header" style={title}>
          {t('emptyFeedTitle')}
        </Text>
        <Text style={description}>
          {t('emptyFeedDescription', { firstName: firstName })}
        </Text>
      </Flex>
    );
  }
}

export const mapStateToProps = ({ auth }, { person }) => {
  return {
    isAppUser: isAppUser(person, auth.person),
  };
};

export default connect(mapStateToProps)(EmptyCelebrateFeed);
