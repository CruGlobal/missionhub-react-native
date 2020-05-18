/* eslint-disable max-lines */
import React, { useCallback } from 'react';
import { Animated, View, SectionListData, Text } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import {
  CommunityFeedItem,
  CombinedFeedItem,
} from '../../components/CommunityFeedItem';
import { keyExtractorId, orgIsGlobal } from '../../utils/common';
import { CreatePostButton } from '../Groups/CreatePostButton';
import { CelebrateFeedSection } from '../../selectors/celebration';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { CollapsibleScrollViewProps } from '../../components/CollapsibleView/CollapsibleView';
import { CommunityFeedItem as FeedItemFragment } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import { momentUtc, isLastTwentyFourHours } from '../../utils/date';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { CelebrateFeedPostCards } from '../CelebrateFeedPostCards';

import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from './queries';
import {
  GetCommunityFeed,
  GetCommunityFeedVariables,
} from './__generated__/GetCommunityFeed';
import {
  GetGlobalCommunityFeed,
  GetGlobalCommunityFeedVariables,
} from './__generated__/GetGlobalCommunityFeed';
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
  filteredFeedType?: FeedItemSubjectTypeEnum;
  collapsibleScrollViewProps?: CollapsibleScrollViewProps;
}

export interface CommunityFeedSection {
  id: number;
  title: string;
  data: FeedItemFragment[];
}

const sortCommunityFeed = (items: FeedItemFragment[]) => {
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

export const CelebrateFeed = ({
  organization,
  person,
  itemNamePressable,
  noHeader,
  showUnreadOnly,
  onRefetch,
  onFetchMore,
  onClearNotification,
  filteredFeedType,
  collapsibleScrollViewProps,
}: CelebrateFeedProps) => {
  const { t } = useTranslation('celebrateFeed');
  const isGlobal = orgIsGlobal(organization);
  const queryVariables = {
    communityId: organization.id,
    personIds: person && person.id,
    hasUnreadComments: showUnreadOnly,
    subjectType: filteredFeedType,
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
      section: { title },
    }: {
      section: SectionListData<CelebrateFeedSection>;
    }) => (
      <View style={styles.header}>
        <Text style={styles.title}>{t(`${title}`)}</Text>
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
            <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />
            {!person ? (
              <CreatePostButton
                refreshItems={handleRefreshing}
                communityId={organization.id}
                type={filteredFeedType}
              />
            ) : null}
            {filteredFeedType || isGlobal ? null : (
              <CelebrateFeedPostCards
                community={organization}
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
      person,
      organization,
      filteredFeedType,
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
