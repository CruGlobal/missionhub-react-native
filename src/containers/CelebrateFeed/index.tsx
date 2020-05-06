import React, { useCallback } from 'react';
import { SectionList, View, SectionListData } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { DateComponent, Button } from '../../components/common';
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
import { CommunityFeedItem as FeedItemFragment } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { momentUtc } from '../../utils/date';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { CELEBRATE_FEED_WITH_TYPE_SCREEN } from '../CelebrateFeedWithType';
import { navigatePush } from '../../actions/navigation';

import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from './queries';
import { GetCommunityFeed } from './__generated__/GetCommunityFeed';
import { GetGlobalCommunityFeed } from './__generated__/GetGlobalCommunityFeed';
import styles from './styles';
import BackButton from '../BackButton';

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
  type?: FeedItemSubjectTypeEnum;
}

export interface CommunityFeedSection {
  id: number;
  date: string;
  data: FeedItemFragment[];
}

const sortCommunityFeed = (items: FeedItemFragment[]) => {
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

const compare = (a: FeedItemFragment, b: FeedItemFragment) => {
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
  type,
}: CelebrateFeedProps) => {
  const { t } = useTranslation('celebrateFeed');
  const dispatch = useDispatch();
  const isGlobal = orgIsGlobal(organization);
  const queryVariables = {
    communityId: organization.id,
    personIds: person && person.id,
    hasUnreadComments: showUnreadOnly,
    subjectType: type,
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

  const items = isGlobal
    ? celebrationSelector({ celebrateItems: globalNodes })
    : sortCommunityFeed(nodes);

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
            {type ? null : (
              <CelebrateFeedHeader
                isMember={!!person}
                organization={organization}
              />
            )}
            {!person ? (
              <CreatePostButton
                refreshItems={handleRefreshing}
                communityId={organization.id}
              />
            ) : null}
            {type ? null : (
              <View>
                <Button
                  type="primary"
                  text="Feed type"
                  onPress={() =>
                    dispatch(
                      navigatePush(CELEBRATE_FEED_WITH_TYPE_SCREEN, {
                        organization,
                        type: FeedItemSubjectTypeEnum.STEP,
                      }),
                    )
                  }
                />
              </View>
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
    ],
  );

  return (
    <SectionList
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
      contentContainerStyle={styles.listContent}
    />
  );
};
