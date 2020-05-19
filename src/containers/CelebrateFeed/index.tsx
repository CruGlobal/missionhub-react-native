import React, { useCallback } from 'react';
import { Animated, View, SectionListData } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { DateComponent } from '../../components/common';
import {
  CommunityFeedItem,
  CombinedFeedItem,
} from '../../components/CommunityFeedItem';
import { keyExtractorId, orgIsGlobal } from '../../utils/common';
import CelebrateFeedHeader from '../CelebrateFeedHeader';
import { CreatePostButton } from '../Groups/CreatePostButton';
import { CelebrateFeedSection } from '../../selectors/celebration';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { CollapsibleScrollViewProps } from '../../components/CollapsibleView/CollapsibleView';
import { CommunityFeedItem as FeedItemFragment } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { momentUtc } from '../../utils/date';

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
  onClearNotification?: (post: FeedItemFragment) => void;
  testID?: string;
  collapsibleScrollViewProps?: CollapsibleScrollViewProps;
}

export interface CommunityFeedSection {
  id: number;
  date: string;
  data: CombinedFeedItem[];
}

const sortCommunityFeed = (items: CombinedFeedItem[]) => {
  const sortByDate = items;
  sortByDate.sort(compare);

  const dateSections: CommunityFeedSection[] = [];
  sortByDate.forEach(item => {
    const length = dateSections.length;
    const itemMoment = momentUtc(item.createdAt);

    if (
      length > 0 &&
      itemMoment.isSame(momentUtc(dateSections[length - 1].date), 'day')
    ) {
      dateSections[length - 1].data.push(item);
    } else {
      dateSections.push({
        id: dateSections.length,
        date: item.createdAt,
        data: [item],
      });
    }
  });

  return dateSections;
};

const compare = (a: CombinedFeedItem, b: CombinedFeedItem) => {
  const aValue = a.createdAt,
    bValue = b.createdAt;

  if (aValue < bValue) {
    return 1;
  }
  if (aValue > bValue) {
    return -1;
  }
  return 0;
};

export const CelebrateFeed = ({
  organization,
  person,
  itemNamePressable,
  noHeader,
  showUnreadOnly,
  onRefetch,
  onFetchMore,
  onClearNotification,
  collapsibleScrollViewProps,
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
        feedItems: {
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
    skip: isGlobal,
  });

  const {
    data: {
      globalCommunity: {
        feedItems: {
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
    skip: !isGlobal,
  });

  const items = sortCommunityFeed(
    (isGlobal ? globalNodes : nodes) as CombinedFeedItem[],
  );

  const handleRefreshing = () => {
    if (loading || globalLoading) {
      return;
    }

    isGlobal ? globalRefetch() : refetch();
    onRefetch && onRefetch();
  };

  const handleOnEndReached = () => {
    if (loading || error || !hasNextPage) {
      return;
    }

    fetchMore({
      variables: {
        ...queryVariables,
        feedCursor: endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        fetchMoreResult
          ? {
              ...prev,
              ...fetchMoreResult,
              community: {
                ...prev.community,
                ...fetchMoreResult.community,
                feedItems: {
                  ...prev.community.feedItems,
                  ...fetchMoreResult.community.feedItems,
                  nodes: [
                    ...(prev.community.feedItems.nodes || []),
                    ...(fetchMoreResult.community.feedItems.nodes || []),
                  ],
                },
              },
            }
          : prev,
    });
    onFetchMore && onFetchMore();
  };

  const handleOnEndReachedGlobal = () => {
    if (globalLoading || globalError || !globalHasNextPage) {
      return;
    }

    globalFetchMore({
      variables: {
        feedCursor: globalEndCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        fetchMoreResult
          ? {
              ...prev,
              ...fetchMoreResult,
              globalCommunity: {
                ...prev.globalCommunity,
                ...fetchMoreResult.globalCommunity,
                feedItems: {
                  ...prev.globalCommunity.feedItems,
                  ...fetchMoreResult.globalCommunity.feedItems,
                  nodes: [
                    ...(prev.globalCommunity.feedItems.nodes || []),
                    ...(fetchMoreResult.globalCommunity.feedItems.nodes || []),
                  ],
                },
              },
            }
          : prev,
    });
    onFetchMore && onFetchMore();
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

  const renderItem = ({ item }: { item: FeedItemFragment }) => (
    <CommunityFeedItem
      onClearNotification={onClearNotification}
      item={item}
      communityId={organization.id}
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
    <Animated.SectionList
      {...collapsibleScrollViewProps}
      sections={items}
      ListHeaderComponent={renderHeader}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractorId}
      onEndReachedThreshold={0.2}
      onEndReached={isGlobal ? handleOnEndReachedGlobal : handleOnEndReached}
      onRefresh={handleRefreshing}
      refreshing={isGlobal ? globalLoading : loading}
      style={styles.list}
      contentContainerStyle={[
        collapsibleScrollViewProps?.contentContainerStyle,
        styles.listContent,
      ]}
    />
  );
};
