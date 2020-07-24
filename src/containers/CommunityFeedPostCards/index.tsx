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
import { PostTypeCardWithPeople } from '../../components/PostTypeLabel';

import {
  GET_COMMUNITY_POST_CARDS,
  MARK_COMMUNITY_FEED_ITEMS_READ,
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

export const CommunityFeedPostCards = ({
  communityId,
  feedRefetch,
}: CommunityFeedPostCardsProps) => {
  const dispatch = useDispatch();
  const isGlobal = orgIsGlobal({ id: communityId });

  const { data } = useQuery<
    GetCommunityPostCards,
    GetCommunityPostCardsVariables
  >(GET_COMMUNITY_POST_CARDS, { variables: { communityId } });

  const groups = getGroupPostCards(data?.community.feedItems.nodes || []);

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

  const renderCard = (type: LimitedPostCardTypes) => (
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
