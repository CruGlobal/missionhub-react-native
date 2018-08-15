import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { translate } from 'react-i18next';

import HEARTS from '../../../assets/images/celebrateHearts.png';
import NullStateComponent from '../NullStateComponent';
import { RefreshControl } from '../common';

@translate('celebrateFeeds')
export default class EmptyCelebrateFeed extends Component {
  renderDescription() {
    const { t, person } = this.props;

    let name = person ? person.first_name : t('emptyFeedGroupNameValue');
    name = name.concat(name.endsWith('s') ? "'" : "'s");

    return t('emptyFeedDescription', { firstName: name });
  }

  render() {
    const { t, refreshCallback, refreshing } = this.props;

    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || false}
            onRefresh={refreshCallback}
          />
        }
      >
        <NullStateComponent
          imageSource={HEARTS}
          headerText={t('emptyFeedTitle')}
          descriptionText={this.renderDescription()}
        />
      </ScrollView>
    );
  }
}
