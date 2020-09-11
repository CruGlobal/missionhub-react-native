/* eslint-disable max-lines */
import React from 'react';
import { View } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { mapPostTypeToFeedType, orgIsGlobal } from '../../utils/common';
import { CommunityFeedItem as FeedItemFragment } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { COMMUNITY_FEED_WITH_TYPE_SCREEN } from '../CommunityFeedWithType';
import { navigatePush } from '../../actions/navigation';
import {
  PostTypeCardWithPeople,
  PostTypeCardWithoutPeople,
} from '../../components/PostTypeLabel';

import {
  GET_COMMUNITY_POST_CARDS,
  MARK_COMMUNITY_FEED_ITEMS_READ,
  GET_GLOBAL_COMMUNITY_POST_CARDS,
  MARK_GLOBAL_FEED_ITEMS_READ,
} from './queries';
import {
  GetCommunityPostCards,
  GetCommunityPostCards_community_feedItems_nodes as FeedItems,
  GetCommunityPostCardsVariables,
} from './__generated__/GetCommunityPostCards';
import {
  GetGlobalCommunityPostCards,
  GetGlobalCommunityPostCards_globalCommunity_feedItems_nodes as GlobalFeedItems,
} from './__generated__/GetGlobalCommunityPostCards';
import { FeedItemPostCard_author } from './__generated__/FeedItemPostCard';
import { FeedItemStepCard_owner } from './__generated__/FeedItemStepCard';
import {
  MarkCommunityFeedItemsReadVariables,
  MarkCommunityFeedItemsRead,
} from './__generated__/MarkCommunityFeedItemsRead';
import {
  MarkGlobalFeedItemsRead,
  MarkGlobalFeedItemsReadVariables,
} from './__generated__/MarkGlobalFeedItemsRead';

interface CommunityFeedPostCardsProps {
  communityId: string;
  feedRefetch: () => void;
}

interface CommunityFeedSection {
  id: number;
  date: string;
  data: FeedItemFragment[];
}

type LimitedPostCardTypes =
  | FeedItemSubjectTypeEnum.PRAYER_REQUEST
  | FeedItemSubjectTypeEnum.STEP
  | FeedItemSubjectTypeEnum.QUESTION
  | FeedItemSubjectTypeEnum.STORY
  | FeedItemSubjectTypeEnum.HELP_REQUEST
  | FeedItemSubjectTypeEnum.ANNOUNCEMENT;

type LimitedGlobalPostCardTypes =
  | FeedItemSubjectTypeEnum.PRAYER_REQUEST
  | FeedItemSubjectTypeEnum.STEP
  | FeedItemSubjectTypeEnum.STORY
  | FeedItemSubjectTypeEnum.ANNOUNCEMENT;

const getCommunityPostCards = (nodes: FeedItems[]) => {
  const groups: {
    [key in LimitedPostCardTypes]:
      | FeedItemPostCard_author[]
      | FeedItemStepCard_owner[];
  } = {
    [FeedItemSubjectTypeEnum.PRAYER_REQUEST]: [],
    [FeedItemSubjectTypeEnum.STEP]: [],
    [FeedItemSubjectTypeEnum.QUESTION]: [],
    [FeedItemSubjectTypeEnum.STORY]: [],
    [FeedItemSubjectTypeEnum.HELP_REQUEST]: [],
    [FeedItemSubjectTypeEnum.ANNOUNCEMENT]: [],
  };

  nodes.forEach(i => {
    const subject = i.subject;
    if (subject.__typename === 'Step') {
      groups[FeedItemSubjectTypeEnum.STEP].push(subject.owner);
    } else if (subject.__typename === 'Post') {
      const feedType = mapPostTypeToFeedType(subject.postType);
      if (
        feedType === FeedItemSubjectTypeEnum.PRAYER_REQUEST ||
        feedType === FeedItemSubjectTypeEnum.QUESTION ||
        feedType === FeedItemSubjectTypeEnum.STORY ||
        feedType === FeedItemSubjectTypeEnum.HELP_REQUEST ||
        feedType === FeedItemSubjectTypeEnum.ANNOUNCEMENT
      ) {
        groups[feedType].push(subject.author);
      }
    }
  });
  return groups;
};

const getGlobalPostCards = (nodes: GlobalFeedItems[]) => {
  const groups: {
    [key in LimitedGlobalPostCardTypes]: number;
  } = {
    [FeedItemSubjectTypeEnum.PRAYER_REQUEST]: 0,
    [FeedItemSubjectTypeEnum.STEP]: 0,
    [FeedItemSubjectTypeEnum.STORY]: 0,
    [FeedItemSubjectTypeEnum.ANNOUNCEMENT]: 0,
  };

  nodes.forEach(i => {
    const subject = i.subject;
    if (subject.__typename === 'Step') {
      groups[FeedItemSubjectTypeEnum.STEP]++;
    } else if (subject.__typename === 'Post') {
      const feedType = mapPostTypeToFeedType(subject.postType);
      if (
        feedType === FeedItemSubjectTypeEnum.PRAYER_REQUEST ||
        feedType === FeedItemSubjectTypeEnum.STORY ||
        feedType === FeedItemSubjectTypeEnum.ANNOUNCEMENT
      ) {
        groups[feedType]++;
      }
    }
  });
  return groups;
};

export const CommunityFeedPostCards = ({
  communityId,
  feedRefetch,
}: CommunityFeedPostCardsProps) => {
  const dispatch = useDispatch();
  const isGlobal = orgIsGlobal({ id: communityId });

  const { data } = useQuery<
    GetCommunityPostCards,
    GetCommunityPostCardsVariables
  >(GET_COMMUNITY_POST_CARDS, { variables: { communityId }, skip: isGlobal });

  const { data: globalData } = useQuery<GetGlobalCommunityPostCards>(
    GET_GLOBAL_COMMUNITY_POST_CARDS,
    { skip: !isGlobal },
  );

  const groups = getCommunityPostCards(data?.community.feedItems.nodes || []);
  const globalGroups = getGlobalPostCards(
    globalData?.globalCommunity.feedItems.nodes || [],
  );

  const [markCommunityFeedItemsAsRead] = useMutation<
    MarkCommunityFeedItemsRead,
    MarkCommunityFeedItemsReadVariables
  >(MARK_COMMUNITY_FEED_ITEMS_READ, {
    refetchQueries: () => [
      { query: GET_COMMUNITY_POST_CARDS, variables: { communityId } },
    ],
  });

  const [markGlobalFeedItemsAsRead] = useMutation<
    MarkGlobalFeedItemsRead,
    MarkGlobalFeedItemsReadVariables
  >(MARK_GLOBAL_FEED_ITEMS_READ, {
    refetchQueries: () => [{ query: GET_GLOBAL_COMMUNITY_POST_CARDS }],
  });

  const navToFeedType = async (type: FeedItemSubjectTypeEnum) => {
    dispatch(
      navigatePush(COMMUNITY_FEED_WITH_TYPE_SCREEN, {
        type,
        communityId,
        communityName: data?.community.name,
      }),
    );

    isGlobal
      ? await markGlobalFeedItemsAsRead({
          variables: {
            input: { feedItemSubjectType: type },
          },
        })
      : await markCommunityFeedItemsAsRead({
          variables: {
            input: { feedItemSubjectType: type, communityId },
          },
        });
    feedRefetch();
  };

  const renderCommunityCard = (type: LimitedPostCardTypes) => (
    <PostTypeCardWithPeople
      testID={`PostCard_${type}`}
      type={type}
      onPress={() => navToFeedType(type)}
      people={groups[type]}
    />
  );

  const renderGlobalCard = (type: LimitedGlobalPostCardTypes) => (
    <PostTypeCardWithoutPeople
      testID={`PostCard_${type}`}
      type={type}
      onPress={() => navToFeedType(type)}
      postsCount={globalGroups[type]}
    />
  );

  return (
    <View>
      {isGlobal ? (
        <>
          <View style={{ flexDirection: 'row' }}>
            {renderGlobalCard(FeedItemSubjectTypeEnum.PRAYER_REQUEST)}
            {renderGlobalCard(FeedItemSubjectTypeEnum.STEP)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {renderGlobalCard(FeedItemSubjectTypeEnum.STORY)}
            {renderGlobalCard(FeedItemSubjectTypeEnum.ANNOUNCEMENT)}
          </View>
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row' }}>
            {renderCommunityCard(FeedItemSubjectTypeEnum.PRAYER_REQUEST)}
            {renderCommunityCard(FeedItemSubjectTypeEnum.STEP)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {renderCommunityCard(FeedItemSubjectTypeEnum.QUESTION)}
            {renderCommunityCard(FeedItemSubjectTypeEnum.STORY)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {renderCommunityCard(FeedItemSubjectTypeEnum.HELP_REQUEST)}
            {renderCommunityCard(FeedItemSubjectTypeEnum.ANNOUNCEMENT)}
          </View>
        </>
      )}
    </View>
  );
};
