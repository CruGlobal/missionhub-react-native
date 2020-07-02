/* eslint-disable max-lines */
import React, { useCallback } from 'react';
import { Animated, View, SectionListData, Text } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { CommunityFeedItem } from '../../components/CommunityFeedItem';
import { keyExtractorId, orgIsGlobal, isAndroid } from '../../utils/common';
import { CreatePostButton } from '../Groups/CreatePostButton';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { CollapsibleScrollViewProps } from '../../components/CollapsibleView/CollapsibleView';
import { CommunityFeedItem as FeedItemFragment } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { momentUtc, isLastTwentyFourHours } from '../../utils/date';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { CommunityFeedPostCards } from '../CommunityFeedPostCards';
import { PostTypeNullState } from '../../components/PostTypeLabel';
import { getStatusBarHeight } from '../../utils/statusbar';

import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from './queries';
import {
  GetCommunityFeed,
  GetCommunityFeedVariables,
  GetCommunityFeed_community_feedItems_nodes,
} from './__generated__/GetCommunityFeed';
import {
  GetGlobalCommunityFeed,
  GetGlobalCommunityFeedVariables,
} from './__generated__/GetGlobalCommunityFeed';
import styles from './styles';

interface CommunityFeedProps {
  communityId: string;
  personId?: string;
  itemNamePressable: boolean;
  noHeader?: boolean;
  showUnreadOnly?: boolean;
  onRefetch?: () => void;
  onFetchMore?: () => void;
  onClearNotification?: (post: FeedItemFragment) => void;
  testID?: string;
  filteredFeedType?: FeedItemSubjectTypeEnum;
  collapsibleScrollViewProps?: CollapsibleScrollViewProps;
}

interface CommunityFeedSection {
  id: number;
  title: string;
  data: FeedItemFragment[];
}

const sortFeedItems = (items: GetCommunityFeed_community_feedItems_nodes[]) => {
  const dateSections: CommunityFeedSection[] = [
    { id: 0, title: 'dates.new', data: [] },
    { id: 1, title: 'dates.today', data: [] },
    { id: 2, title: 'dates.earlier', data: [] },
  ];
  items.forEach(item => {
    const itemMoment = momentUtc(item.createdAt);
    if (isLastTwentyFourHours(itemMoment) && !item.read) {
      dateSections[0].data.push(item);
      return;
    }
    if (isLastTwentyFourHours(itemMoment)) {
      dateSections[1].data.push(item);
    } else {
      dateSections[2].data.push(item);
    }
  });
  // Filter out any sections with no data
  const filteredSections = dateSections.filter(
    section => section.data.length > 0,
  );

  return filteredSections;
};

export const CommunityFeed = ({
  communityId,
  personId,
  itemNamePressable,
  noHeader,
  showUnreadOnly,
  onRefetch,
  onFetchMore,
  onClearNotification,
  filteredFeedType,
  collapsibleScrollViewProps,
}: CommunityFeedProps) => {
  const { t } = useTranslation('communityFeed');
  const isGlobal = orgIsGlobal({ id: communityId });
  const queryVariables = {
    communityId,
    personIds: (personId && [personId]) || undefined,
    hasUnreadComments: showUnreadOnly,
    subjectType: filteredFeedType ? [filteredFeedType] : undefined,
  };

  const {
    data: {
      community: {
        feedItems: {
          nodes = [],
          pageInfo: { endCursor = null, hasNextPage = false } = {},
        } = {},
      } = {},
      currentUser: { person = undefined } = {},
    } = {},
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery<GetCommunityFeed, GetCommunityFeedVariables>(
    GET_COMMUNITY_FEED,
    {
      variables: queryVariables,
      skip: isGlobal,
    },
  );

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
      currentUser: { person: globalPerson = undefined } = {},
    } = {},
    loading: globalLoading,
    error: globalError,
    fetchMore: globalFetchMore,
    refetch: globalRefetch,
  } = useQuery<GetGlobalCommunityFeed, GetGlobalCommunityFeedVariables>(
    GET_GLOBAL_COMMUNITY_FEED,
    {
      skip: !isGlobal,
    },
  );

  const items = sortFeedItems(isGlobal ? globalNodes : nodes);

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
        feedItemsCursor: endCursor,
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
        feedItemsCursor: globalEndCursor,
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
      section: { title },
    }: {
      section: SectionListData<CommunityFeedSection>;
    }) => (
      <View
        style={[
          styles.header,
          // We need to add extra padding because we can't use a SafeAreaView in the section header.
          // And we can't wrap the whole SectionList in the SafeAreaView because it messes with the collapsible header
          !filteredFeedType && !isAndroid
            ? { paddingTop: getStatusBarHeight() }
            : null,
        ]}
      >
        <Text style={styles.title}>{t(`${title}`)}</Text>
      </View>
    ),
    [],
  );

  const renderItem = ({ item }: { item: FeedItemFragment }) => (
    <CommunityFeedItem
      onClearNotification={onClearNotification}
      feedItem={item}
      namePressable={itemNamePressable}
      postTypePressable={!personId && !filteredFeedType}
    />
  );

  const renderHeader = useCallback(
    () => (
      <>
        <ErrorNotice
          message={t('errorLoadingCommunityFeed')}
          error={error}
          refetch={refetch}
        />
        <ErrorNotice
          message={t('errorLoadingCommunityFeed')}
          error={globalError}
          refetch={globalRefetch}
        />
        {noHeader || isGlobal ? null : (
          <>
            <CreatePostButton
              person={person || globalPerson}
              communityId={communityId}
              type={filteredFeedType}
            />
            {filteredFeedType ? null : (
              <CommunityFeedPostCards
                communityId={communityId}
                // Refetch the feed to update new section once read
                feedRefetch={refetch}
              />
            )}
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
      communityId,
      person,
      personId,
      filteredFeedType,
    ],
  );
  const renderEmpty = useCallback(
    () =>
      filteredFeedType ? <PostTypeNullState type={filteredFeedType} /> : null,
    [filteredFeedType],
  );

  return (
    <Animated.SectionList
      {...collapsibleScrollViewProps}
      sections={items}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={renderHeader}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={true}
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
      scrollIndicatorInsets={{ right: 1 }} // Fix for scrollbar occasionally floating away from the right https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
    />
  );
};
