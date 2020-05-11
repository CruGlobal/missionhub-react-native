/* eslint-disable max-lines */
import React from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { orgIsGlobal } from '../../utils/common';
import { celebrationSelector } from '../../selectors/celebration';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';
import { CollapsibleScrollViewProps } from '../../components/CollapsibleView/CollapsibleView';
import { CommunityFeedItem as FeedItemFragment } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { momentUtc } from '../../utils/date';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { CELEBRATE_FEED_WITH_TYPE_SCREEN } from '../CelebrateFeedWithType';
import { navigatePush } from '../../actions/navigation';
import { PostTypeCardWithPeople } from '../../components/PostTypeLabel';

import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from './queries';
import styles from './styles';

export interface CelebrateFeedPostCardsProps {
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

export const CelebrateFeedPostCards = ({
  organization,
}: CelebrateFeedPostCardsProps) => {
  const dispatch = useDispatch();
  const isGlobal = orgIsGlobal(organization);
  const queryVariables = {
    communityId: organization.id,
  };

  const {
    data: { community: { feedItems: { nodes = [] } = {} } = {} } = {},
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

  const navToFeedType = (type: FeedItemSubjectTypeEnum) => {
    dispatch(
      navigatePush(CELEBRATE_FEED_WITH_TYPE_SCREEN, { type, organization }),
    );
  };

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <PostTypeCardWithPeople
          type={FeedItemSubjectTypeEnum.PRAYER_REQUEST}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.PRAYER_REQUEST)}
        />
        <PostTypeCardWithPeople
          type={FeedItemSubjectTypeEnum.STEP}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.STEP)}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <PostTypeCardWithPeople
          type={FeedItemSubjectTypeEnum.QUESTION}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.QUESTION)}
        />
        <PostTypeCardWithPeople
          type={FeedItemSubjectTypeEnum.STORY}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.STORY)}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <PostTypeCardWithPeople
          type={FeedItemSubjectTypeEnum.HELP_REQUEST}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.HELP_REQUEST)}
        />
        <PostTypeCardWithPeople
          type={FeedItemSubjectTypeEnum.ANNOUNCEMENT}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.ANNOUNCEMENT)}
        />
      </View>
    </View>
  );
};
