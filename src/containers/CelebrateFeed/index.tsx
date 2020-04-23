import React, { useCallback } from 'react';
import { SectionList, View, SectionListData } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { DateComponent } from '../../components/common';
import { CommunityFeedItem } from '../../components/CommunityFeedItem';
import { keyExtractorId, orgIsGlobal } from '../../utils/common';
import CelebrateFeedHeader from '../CelebrateFeedHeader';
import { CreatePostButton } from '../Groups/CreatePostButton';
import {
  celebrationSelector,
  CelebrateFeedSection,
} from '../../selectors/celebration';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { CommunityPost } from '../../components/CommunityFeedItem/__generated__/CommunityPost';

import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from './queries';
import { GetCommunityFeed } from './__generated__/GetCommunityFeed';
import { GetGlobalCommunityFeed } from './__generated__/GetGlobalCommunityFeed';
import styles from './styles';

export interface CelebrateFeedProps {
  organization: Organization;
  person?: Person;
  itemNamePressable: boolean;
  noHeader?: boolean;
  showUnreadOnly?: boolean;
  onRefetch?: () => void;
  onFetchMore?: () => void;
  onClearNotification?: (post: CommunityPost) => void;
  testID?: string;
}

export const CelebrateFeed = ({
  organization,
  person,
  itemNamePressable,
  noHeader,
  showUnreadOnly,
  onRefetch,
  onFetchMore,
  onClearNotification,
}: CelebrateFeedProps) => {
  const { t } = useTranslation('celebrateFeed');
  const isGlobal = orgIsGlobal(organization);
  const queryVariables = {
    communityId: organization.id,
    personIds: person && person.id,
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
    error,
    fetchMore,
    refetch,
  } = useQuery<GetCommunityFeed>(GET_COMMUNITY_FEED, {
    variables: queryVariables,
    pollInterval: 30000,
    skip: isGlobal,
  });

  const {
    data: {
      globalCommunity: {
        celebrationItems: {
          nodes: globalNodes = [],
          pageInfo: {
            endCursor: globalEndCursor = null,
            hasNextPage: globalHasNextPage = false,
          } = {},
        } = {},
      } = {},
    } = {},
    loading: globalLoading,
    error: globalError,
    fetchMore: globalFetchMore,
    refetch: globalRefetch,
  } = useQuery<GetGlobalCommunityFeed>(GET_GLOBAL_COMMUNITY_FEED, {
    pollInterval: 30000,
    skip: !isGlobal,
  });

  const celebrationItems = celebrationSelector({
    celebrateItems: isGlobal ? globalNodes : nodes,
  });

  const handleRefreshing = () => {
    isGlobal ? globalRefetch() : refetch();
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

  const handleOnEndReachedGlobal = () => {
    if (globalHasNextPage) {
      globalFetchMore({
        variables: {
          ...queryVariables,
          celebrateCursor: globalEndCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) =>
          fetchMoreResult
            ? {
                ...prev,
                ...fetchMoreResult,
                globalCommunity: {
                  ...prev.globalCommunity,
                  ...fetchMoreResult.globalCommunity,
                  celebrationItems: {
                    ...prev.globalCommunity.celebrationItems,
                    ...fetchMoreResult.globalCommunity.celebrationItems,
                    nodes: [
                      ...(prev.globalCommunity.celebrationItems.nodes || []),
                      ...(fetchMoreResult.globalCommunity.celebrationItems
                        .nodes || []),
                    ],
                  },
                },
              }
            : prev,
      });
      onFetchMore && onFetchMore();
    }
  };

  const renderSectionHeader = useCallback(
    ({
      section: { date },
    }: {
      section: SectionListData<CelebrateFeedSection>;
    }) => (
      <View style={styles.header}>
        <DateComponent
          date={date}
          relativeFormatting={true}
          style={styles.title}
        />
      </View>
    ),
    [],
  );

  const renderItem = ({ item }: { item: CommunityPost }) => (
    <CommunityFeedItem
      onClearNotification={onClearNotification}
      post={item}
      orgId={organization.id}
      namePressable={itemNamePressable}
      onRefresh={handleRefreshing}
    />
  );

  const renderHeader = useCallback(
    () => (
      <>
        <ErrorNotice
          message={t('errorLoadingCelebrateFeed')}
          error={error}
          refetch={refetch}
        />
        <ErrorNotice
          message={t('errorLoadingCelebrateFeed')}
          error={globalError}
          refetch={globalRefetch}
        />
        {noHeader ? null : (
          <>
            <CelebrateFeedHeader
              isMember={!!person}
              organization={organization}
            />
            {!person ? (
              <CreatePostButton
                refreshItems={handleRefreshing}
                communityId={organization.id}
              />
            ) : null}
          </>
        )}
      </>
    ),
    [
      error,
      refetch,
      globalError,
      globalRefetch,
      noHeader,
      person,
      organization,
    ],
  );

  return (
    <SectionList
      sections={celebrationItems}
      ListHeaderComponent={renderHeader}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractorId}
      onEndReachedThreshold={0.2}
      onEndReached={isGlobal ? handleOnEndReachedGlobal : handleOnEndReached}
      onRefresh={handleRefreshing}
      refreshing={isGlobal ? globalLoading : loading}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};
