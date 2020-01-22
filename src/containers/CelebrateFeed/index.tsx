import React, { useState } from 'react';
import { SectionList, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { DateComponent } from '../../components/common';
import CelebrateItemCard from '../../components/CelebrateItem';
import { DateConstants } from '../../components/DateComponent';
import { keyExtractorId } from '../../utils/common';
import CelebrateFeedHeader from '../CelebrateFeedHeader';
import ShareStoryInput from '../Groups/ShareStoryInput';
import { CelebrateItem } from '../../selectors/celebration';
import { Organization } from '../../reducers/organizations';

import styles from './styles';

type CelebrateSection = { id: number; date: string; data: CelebrateItem[] };

export interface CelebrateFeedProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  items: CelebrateSection[];
  organization: Organization;
  refreshing: boolean;
  refreshCallback: () => void;
  itemNamePressable: boolean;
  isMember?: boolean;
  noHeader?: boolean;
  onClearNotification?: () => void;
  loadMoreItemsCallback: () => void;
}

const CelebrateFeed = ({
  dispatch,
  items,
  organization,
  refreshing,
  refreshCallback,
  itemNamePressable,
  isMember,
  noHeader,
  onClearNotification,
  loadMoreItemsCallback,
}: CelebrateFeedProps) => {
  const [isListScrolled, setIsListScrolled] = useState(false);

  const renderSectionHeader = ({
    section: { date },
  }: {
    section: CelebrateSection;
  }) => (
    <View style={styles.header}>
      <DateComponent
        date={date}
        format={DateConstants.relative}
        style={styles.title}
      />
    </View>
  );

  const renderItem = ({ item }: { item: CelebrateItem }) => (
    <CelebrateItemCard
      onClearNotification={onClearNotification}
      event={item}
      organization={organization}
      namePressable={itemNamePressable}
      onRefresh={refreshCallback}
    />
  );

  const handleOnEndReached = () => {
    if (isListScrolled) {
      loadMoreItemsCallback();
      setIsListScrolled(false);
    }
  };

  const handleEndDrag = () => {
    if (!isListScrolled) {
      setIsListScrolled(true);
    }
  };

  const handleRefreshing = () => refreshCallback();

  const renderHeader = () => (
    <>
      <CelebrateFeedHeader isMember={isMember} organization={organization} />
      <ShareStoryInput
        dispatch={dispatch}
        refreshItems={refreshCallback}
        organization={organization}
      />
    </>
  );

  return (
    <SectionList
      sections={items}
      ListHeaderComponent={noHeader ? undefined : renderHeader}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractorId}
      onEndReachedThreshold={0.2}
      onEndReached={handleOnEndReached}
      onScrollEndDrag={handleEndDrag}
      onRefresh={handleRefreshing}
      refreshing={refreshing || false}
      extraData={{ isListScrolled }}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

export default connect()(CelebrateFeed);
