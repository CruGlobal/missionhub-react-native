import React from 'react';
import { SectionList, View, SectionListData } from 'react-native';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useQuery } from '@apollo/react-hooks';

import { DateComponent } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import { DateConstants } from '../../components/DateComponent';
import { keyExtractorId } from '../../utils/common';
import CelebrateFeedHeader from '../CelebrateFeedHeader';
import ShareStoryInput from '../Groups/ShareStoryInput';
import {
  celebrationSelector,
  CelebrateFeedSection,
} from '../../selectors/celebration';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';

import { GET_CELEBRATE_FEED } from './queries';
import {
  GetCelebrateFeed,
  GetCelebrateFeed_community_celebrationItems_nodes,
} from './__generated__/GetCelebrateFeed';
import styles from './styles';

export interface CelebrateFeedProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  organization: Organization;
  person?: Person;
  itemNamePressable: boolean;
  noHeader?: boolean;
  showUnreadOnly?: boolean;
  onRefetch?: () => void;
  onFetchMore?: () => void;
  onClearNotification?: (
    event: GetCelebrateFeed_community_celebrationItems_nodes,
  ) => void;
  testID?: string;
}

const CelebrateFeed = ({
  dispatch,
  organization,
  person,
  itemNamePressable,
  noHeader,
  showUnreadOnly,
  onRefetch,
  onFetchMore,
  onClearNotification,
}: CelebrateFeedProps) => {
  const queryVariables = {
    communityId: organization.id,
    personIds: (person && [person.id]) || undefined,
    hasUnreadComments: showUnreadOnly,
  };

  const {
    data: {
      community: {
        celebrationItems: {
          nodes = [],
          pageInfo: { endCursor = null, hasNextPage = false } = {},
        } = {},
      } = {},
    } = {},
    loading,
    fetchMore,
    refetch,
  } = useQuery<GetCelebrateFeed>(GET_CELEBRATE_FEED, {
    variables: queryVariables,
    pollInterval: 30000,
    notifyOnNetworkStatusChange: true,
  });

  const celebrationItems = celebrationSelector({ celebrateItems: nodes });

  const handleRefreshing = () => {
    refetch();
    onRefetch && onRefetch();
  };

  const handleOnEndReached = () => {
    if (hasNextPage) {
      fetchMore({
        variables: {
          ...queryVariables,
          celebrateCursor: endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) =>
          fetchMoreResult
            ? {
                ...prev,
                ...fetchMoreResult,
                community: {
                  ...prev.community,
                  ...fetchMoreResult.community,
                  celebrationItems: {
                    ...prev.community.celebrationItems,
                    ...fetchMoreResult.community.celebrationItems,
                    nodes: [
                      ...(prev.community.celebrationItems.nodes || []),
                      ...(fetchMoreResult.community.celebrationItems.nodes ||
                        []),
                    ],
                  },
                },
              }
            : prev,
      });
      onFetchMore && onFetchMore();
    }
  };

  const renderSectionHeader = ({
    section: { date },
  }: {
    section: SectionListData<CelebrateFeedSection>;
  }) => (
    <View style={styles.header}>
      <DateComponent
        date={date}
        format={DateConstants.relative}
        style={styles.title}
      />
    </View>
  );

  const renderItem = ({
    item,
  }: {
    item: GetCelebrateFeed_community_celebrationItems_nodes;
  }) => (
    <CelebrateItem
      onClearNotification={onClearNotification}
      event={item}
      organization={organization}
      namePressable={itemNamePressable}
      onRefresh={handleRefreshing}
    />
  );

  const renderHeader = () => (
    <>
      <CelebrateFeedHeader isMember={!!person} organization={organization} />
      <ShareStoryInput
        dispatch={dispatch}
        refreshItems={handleRefreshing}
        organization={organization}
      />
    </>
  );

  return (
    <SectionList
      sections={celebrationItems}
      ListHeaderComponent={noHeader ? undefined : renderHeader}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractorId}
      onEndReachedThreshold={0.2}
      onEndReached={handleOnEndReached}
      onRefresh={handleRefreshing}
      refreshing={loading}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

export default connect()(CelebrateFeed);
