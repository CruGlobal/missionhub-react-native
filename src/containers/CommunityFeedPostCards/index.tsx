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
} from './queries';
import {
  GetCommunityPostCards,
  GetCommunityPostCards_community_feedItems_nodes,
  GetCommunityPostCardsVariables,
} from './__generated__/GetCommunityPostCards';
import { FeedItemPostCard_author } from './__generated__/FeedItemPostCard';
import { FeedItemStepCard_owner } from './__generated__/FeedItemStepCard';
import {
  MarkCommunityFeedItemsReadVariables,
  MarkCommunityFeedItemsRead,
} from './__generated__/MarkCommunityFeedItemsRead';
import {
  GetGlobalCommunityPostCards,
  GetGlobalCommunityPostCards_globalCommunity_feedItems_nodes,
} from './__generated__/GetGlobalCommunityPostCards';

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

const getGroupPostCards = (
  nodes: GetCommunityPostCards_community_feedItems_nodes[],
) => {
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

const getGlobalGroupPostCards = (
  nodes: GetGlobalCommunityPostCards_globalCommunity_feedItems_nodes[],
) => {
  const groups: {
    [key in LimitedGlobalPostCardTypes]: GetGlobalCommunityPostCards_globalCommunity_feedItems_nodes[];
  } = {
    [FeedItemSubjectTypeEnum.PRAYER_REQUEST]: [],
    [FeedItemSubjectTypeEnum.STEP]: [],
    [FeedItemSubjectTypeEnum.STORY]: [],
    [FeedItemSubjectTypeEnum.ANNOUNCEMENT]: [],
  };
  nodes.forEach(i => {
    const subject = i.subject;
    if (subject.__typename === 'Step') {
      groups[FeedItemSubjectTypeEnum.STEP].push(i);
    } else if (subject.__typename === 'Post') {
      const feedType = mapPostTypeToFeedType(subject.postType);
      if (
        feedType === FeedItemSubjectTypeEnum.PRAYER_REQUEST ||
        feedType === FeedItemSubjectTypeEnum.STORY ||
        feedType === FeedItemSubjectTypeEnum.ANNOUNCEMENT
      ) {
        groups[feedType].push(i);
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
  console.log(isGlobal);
  const { data } = useQuery<
    GetCommunityPostCards,
    GetCommunityPostCardsVariables
  >(GET_COMMUNITY_POST_CARDS, { variables: { communityId }, skip: isGlobal });

  const { data: globalData } = useQuery<GetGlobalCommunityPostCards>(
    GET_GLOBAL_COMMUNITY_POST_CARDS,
    { skip: !isGlobal },
  );
  console.log(globalData);
  const groups = getGroupPostCards(data?.community.feedItems.nodes || []);
  const globalGroups = getGlobalGroupPostCards(
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

  const navToFeedType = async (type: FeedItemSubjectTypeEnum) => {
    dispatch(
      navigatePush(COMMUNITY_FEED_WITH_TYPE_SCREEN, {
        type,
        communityId,
        communityName: data?.community.name,
      }),
    );
    await markCommunityFeedItemsAsRead({
      variables: {
        input: { feedItemSubjectType: type, communityId },
      },
    });
    feedRefetch();
  };

  const renderCard = (type: LimitedPostCardTypes) =>
    isGlobal ? (
      <PostTypeCardWithoutPeople
        testID={`PostCard_${type}`}
        type={type}
        onPress={() => navToFeedType(type)}
        items={globalGroups[type]}
      />
    ) : (
      <PostTypeCardWithPeople
        testID={`PostCard_${type}`}
        type={type}
        onPress={() => navToFeedType(type)}
        people={groups[type]}
      />
    );

  return (
    <View>
      {isGlobal ? (
        <>
          <View style={{ flexDirection: 'row' }}>
            {renderCard(FeedItemSubjectTypeEnum.PRAYER_REQUEST)}
            {renderCard(FeedItemSubjectTypeEnum.STEP)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {renderCard(FeedItemSubjectTypeEnum.STORY)}
            {renderCard(FeedItemSubjectTypeEnum.ANNOUNCEMENT)}
          </View>
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row' }}>
            {renderCard(FeedItemSubjectTypeEnum.PRAYER_REQUEST)}
            {renderCard(FeedItemSubjectTypeEnum.STEP)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {renderCard(FeedItemSubjectTypeEnum.QUESTION)}
            {renderCard(FeedItemSubjectTypeEnum.STORY)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {renderCard(FeedItemSubjectTypeEnum.HELP_REQUEST)}
            {renderCard(FeedItemSubjectTypeEnum.ANNOUNCEMENT)}
          </View>
        </>
      )}
    </View>
  );
};
