import React, { useState } from 'react';
import { SectionList, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { DateComponent } from '../../components/common';
import CelebrateItemCard from '../../components/CelebrateItem';
import { DateConstants } from '../../components/DateComponent';
import { keyExtractorId } from '../../utils/common';
import CelebrateFeedHeader from '../CelebrateFeedHeader';
import ShareStoryInput from '../Groups/ShareStoryInput';
import {
  celebrationSelector,
  CelebrateFeedSection,
} from '../../selectors/celebration';
import { Organization } from '../../reducers/organizations';
import { useRefreshing } from '../../utils/hooks/useRefreshing';

import { GetCelebrateFeed } from './__generated__/GetCelebrateFeed';
import styles from './styles';

export const GET_CELEBRATE_FEED = gql`
  query GetCelebrateFeed($communityId: [ID!], $celebrateCursor: String) {
    community(id: $communityId) {
      celebrationItems(
        sortBy: createdAt_ASC
        first: 25
        after: $celebrateCursor
      ) {
        nodes {
          id
          adjectiveAttributeName
          adjectiveAttributeValue
          celebrateableId
          celebrateableType
          changedAttributeName
          changedAttributeValue
          commentsCount
          liked
          likesCount
          objectDescription
          subjectPersonName
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export interface CelebrateFeedProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  organization: Organization;
  refreshCallback: () => void;
  itemNamePressable: boolean;
  isMember?: boolean;
  noHeader?: boolean;
  onClearNotification?: () => void;
  loadMoreItemsCallback: () => void;
}

const CelebrateFeed = ({
  dispatch,
  organization,
  refreshCallback,
  itemNamePressable,
  isMember,
  noHeader,
  onClearNotification,
}: CelebrateFeedProps) => {
  const [isListScrolled, setIsListScrolled] = useState(false);

  const {
    data: {
      community: {
        celebrationItems: {
          nodes = [],
          pageInfo: { endCursor = null, hasNextPage = true } = {},
        } = {},
      } = {},
    } = {},
    fetchMore,
    refetch,
  } = useQuery<GetCelebrateFeed>(GET_CELEBRATE_FEED, {
    variables: {
      communityId: [organization.id],
    },
    pollInterval: 30000,
  });

  const celebrationItems = celebrationSelector({ celebrateItems: nodes });

  const { isRefreshing, refresh } = useRefreshing(refetch);

  const handleRefreshing = () => refresh();

  const handleOnEndReached = () => {
    if (isListScrolled && hasNextPage) {
      fetchMore({
        variables: {
          communityId: [organization.id],
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
      setIsListScrolled(false);
    }
  };

  const handleEndDrag = () => {
    if (!isListScrolled) {
      setIsListScrolled(true);
    }
  };

  const renderSectionHeader = ({
    section: { date },
  }: {
    section: CelebrateFeedSection;
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
      sections={celebrationItems}
      ListHeaderComponent={noHeader ? undefined : renderHeader}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractorId}
      onEndReachedThreshold={0.2}
      onEndReached={handleOnEndReached}
      onScrollEndDrag={handleEndDrag}
      onRefresh={handleRefreshing}
      refreshing={isRefreshing}
      extraData={{ isListScrolled }}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

export default connect()(CelebrateFeed);
