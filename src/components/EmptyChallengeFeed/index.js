import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { translate } from 'react-i18next';

import TARGET from '../../../assets/images/target.png';
import NullStateComponent from '../NullStateComponent';
import { RefreshControl } from '../common';

@translate('challengeFeeds')
export default class EmptyChallengeFeed extends Component {
  render() {
    const { t, refreshCallback, refreshing } = this.props;

    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshCallback} />
        }
      >
        <NullStateComponent
          imageSource={TARGET}
          headerText={t('emptyFeedTitle')}
          descriptionText={t('emptyFeedDescription')}
        />
      </ScrollView>
    );
  }
}
