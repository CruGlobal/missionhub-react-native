/* eslint-disable max-lines */
import React from 'react';
import { View } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { mapPostTypeToFeedType } from '../../utils/common';
import { Organization } from '../../reducers/organizations';
import { CommunityFeedItem as FeedItemFragment } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { CELEBRATE_FEED_WITH_TYPE_SCREEN } from '../CelebrateFeedWithType';
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

export interface CelebrateFeedPostCardsProps {
  community: Organization;
  feedRefetch: () => void;
}

export interface CommunityFeedSection {
  id: number;
  date: string;
  data: FeedItemFragment[];
}

const getGroupPostCards = (
  nodes: GetCommunityPostCards_community_feedItems_nodes[],
) => {
  const groups: {
    [key in
      | FeedItemSubjectTypeEnum.PRAYER_REQUEST
      | FeedItemSubjectTypeEnum.STEP
      | FeedItemSubjectTypeEnum.QUESTION
      | FeedItemSubjectTypeEnum.STORY
      | FeedItemSubjectTypeEnum.HELP_REQUEST
      | FeedItemSubjectTypeEnum.ANNOUNCEMENT]:
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

export const CelebrateFeedPostCards = ({
  community,
  feedRefetch,
}: CelebrateFeedPostCardsProps) => {
  const dispatch = useDispatch();

  const { data } = useQuery<
    GetCommunityPostCards,
    GetCommunityPostCardsVariables
  >(GET_COMMUNITY_POST_CARDS, { variables: { communityId: community.id } });

  const groups = getGroupPostCards(data?.community.feedItems.nodes || []);

  const [markCommunityFeedItemsAsRead] = useMutation<
    MarkCommunityFeedItemsRead,
    MarkCommunityFeedItemsReadVariables
  >(MARK_COMMUNITY_FEED_ITEMS_READ, {
    awaitRefetchQueries: true,
    refetchQueries: () => {
      return [
        {
          query: GET_COMMUNITY_POST_CARDS,
          variables: { communityId: community.id },
        },
      ];
    },
  });

  const navToFeedType = async (type: FeedItemSubjectTypeEnum) => {
    dispatch(
      navigatePush(CELEBRATE_FEED_WITH_TYPE_SCREEN, {
        type,
        organization: community,
      }),
    );
    await markCommunityFeedItemsAsRead({
      variables: {
        input: { feedItemSubjectType: type, communityId: community.id },
      },
    });
    feedRefetch();
  };

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <PostTypeCardWithPeople
          testID="PostCard_PRAYER_REQUEST"
          type={FeedItemSubjectTypeEnum.PRAYER_REQUEST}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.PRAYER_REQUEST)}
          people={groups[FeedItemSubjectTypeEnum.PRAYER_REQUEST]}
        />
        <PostTypeCardWithPeople
          testID="PostCard_STEP"
          type={FeedItemSubjectTypeEnum.STEP}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.STEP)}
          people={groups[FeedItemSubjectTypeEnum.STEP]}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <PostTypeCardWithPeople
          testID="PostCard_QUESTION"
          type={FeedItemSubjectTypeEnum.QUESTION}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.QUESTION)}
          people={groups[FeedItemSubjectTypeEnum.QUESTION]}
        />
        <PostTypeCardWithPeople
          testID="PostCard_STORY"
          type={FeedItemSubjectTypeEnum.STORY}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.STORY)}
          people={groups[FeedItemSubjectTypeEnum.STORY]}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <PostTypeCardWithPeople
          testID="PostCard_HELP_REQUEST"
          type={FeedItemSubjectTypeEnum.HELP_REQUEST}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.HELP_REQUEST)}
          people={groups[FeedItemSubjectTypeEnum.HELP_REQUEST]}
        />
        <PostTypeCardWithPeople
          testID="PostCard_ANNOUNCEMENT"
          type={FeedItemSubjectTypeEnum.ANNOUNCEMENT}
          onPress={() => navToFeedType(FeedItemSubjectTypeEnum.ANNOUNCEMENT)}
          people={groups[FeedItemSubjectTypeEnum.ANNOUNCEMENT]}
          countOnly={true}
        />
      </View>
    </View>
  );
};
