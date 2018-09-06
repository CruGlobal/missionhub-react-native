import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { translate } from 'react-i18next';

// TODO: Use the right null image for challenges
import HEARTS from '../../../assets/images/celebrateHearts.png';
import NullStateComponent from '../NullStateComponent';
import { RefreshControl } from '../common';

@translate('challengeFeeds')
export default class EmptyCelebrateFeed extends Component {
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
          imageSource={HEARTS}
          headerText={t('emptyFeedTitle')}
          descriptionText={t('emptyFeedDescription')}
        />
      </ScrollView>
    );
  }
}
