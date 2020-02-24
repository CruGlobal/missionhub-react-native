import React from 'react';
import { SectionList, View, SectionListData } from 'react-native';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useQuery } from '@apollo/react-hooks';
import {
  FlatFeed,
  Activity,
  ReactionToggleIcon,
  StatusUpdateForm,
  buildStylesheet,
} from 'react-native-activity-feed';

import GREY_HEART from '../../../assets/images/heart-grey.png';
import BLUE_HEART from '../../../assets/images/heart-blue.png';
import { DateComponent } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import { DateConstants } from '../../components/DateComponent';
import { keyExtractorId, orgIsGlobal } from '../../utils/common';
import CelebrateFeedHeader from '../CelebrateFeedHeader';
import ShareStoryInput from '../Groups/ShareStoryInput';
import {
  celebrationSelector,
  CelebrateFeedSection,
} from '../../selectors/celebration';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';

import { GET_CELEBRATE_FEED, GET_GLOBAL_CELEBRATE_FEED } from './queries';
import {
  GetCelebrateFeed,
  GetCelebrateFeed_community_celebrationItems_nodes,
} from './__generated__/GetCelebrateFeed';
import { GetGlobalCelebrateFeed } from './__generated__/GetGlobalCelebrateFeed';
import styles from './styles';

export interface CelebrateFeedProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  organization: Organization;
  person?: Person;
  itemNamePressable: boolean;
  noHeader?: boolean;
  showUnreadOnly?: boolean;
  onRefetch?: () => void;
  onFetchMore?: () => void;
  onClearNotification?: (
    event: GetCelebrateFeed_community_celebrationItems_nodes,
  ) => void;
  testID?: string;
}

const CelebrateFeed = ({
  dispatch,
  organization,
  person,
  itemNamePressable,
  noHeader,
  showUnreadOnly,
  onRefetch,
  onFetchMore,
  onClearNotification,
}: CelebrateFeedProps) => {
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
    fetchMore,
    refetch,
  } = useQuery<GetCelebrateFeed>(GET_CELEBRATE_FEED, {
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
    fetchMore: globalFetchMore,
    refetch: globalRefetch,
  } = useQuery<GetGlobalCelebrateFeed>(GET_GLOBAL_CELEBRATE_FEED, {
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

  const renderSectionHeader = ({
    section: { date },
  }: {
    section: SectionListData<CelebrateFeedSection>;
  }) => (
    <View style={styles.header}>
      <DateComponent
        date={date}
        format={DateConstants.relative}
        style={styles.title}
      />
    </View>
  );

  const renderItem = ({
    item,
  }: {
    item: GetCelebrateFeed_community_celebrationItems_nodes;
  }) => (
    <CelebrateItem
      onClearNotification={onClearNotification}
      event={item}
      organization={organization}
      namePressable={itemNamePressable}
      onRefresh={handleRefreshing}
    />
  );

  const renderHeader = () => (
    <>
      <CelebrateFeedHeader isMember={!!person} organization={organization} />
      {!person ? (
        <ShareStoryInput
          dispatch={dispatch}
          refreshItems={handleRefreshing}
          organization={organization}
        />
      ) : null}
    </>
  );

  return (
    <>
      <FlatFeed feedGroup="CelebrateFeed" Activity={CustomActivity} />
      <StatusUpdateForm feedGroup="CelebrateFeed" />
    </>
    // <SectionList
    //   sections={celebrationItems}
    //   ListHeaderComponent={noHeader ? undefined : renderHeader}
    //   renderSectionHeader={renderSectionHeader}
    //   renderItem={renderItem}
    //   keyExtractor={keyExtractorId}
    //   onEndReachedThreshold={0.2}
    //   onEndReached={isGlobal ? handleOnEndReachedGlobal : handleOnEndReached}
    //   onRefresh={handleRefreshing}
    //   refreshing={isGlobal ? globalLoading : loading}
    //   style={styles.list}
    //   contentContainerStyle={styles.listContent}
    // />
  );
};

export default connect()(CelebrateFeed);

const CustomActivity = props => {
  return <Activity {...props} Footer={<LikeButton {...props} />} />;
};

export class LikeButton extends React.Component {
  static defaultProps = {
    reactionKind: 'like',
  };
  _onPress = () => {
    const {
      activity,
      reaction,
      reactionKind,
      onToggleReaction,
      onToggleChildReaction,
    } = this.props;

    if (reaction && onToggleChildReaction) {
      return onToggleChildReaction(reactionKind, reaction, {}, {});
    }
    return onToggleReaction(reactionKind, activity, {}, {});
  };

  render() {
    const { activity, reaction, reactionKind } = this.props;
    const styles = buildStylesheet('likeButton', this.props.styles);
    let counts, own_reactions;
    if (reaction && this.props.onToggleChildReaction) {
      counts = reaction.children_counts;
      own_reactions = reaction.own_children;
    } else {
      counts = activity.reaction_counts;
      own_reactions = activity.own_reactions;
    }

    return (
      <ReactionToggleIcon
        styles={styles}
        counts={counts}
        own_reactions={own_reactions}
        kind={reactionKind}
        onPress={this._onPress}
        activeIcon={BLUE_HEART}
        inactiveIcon={GREY_HEART}
        labelSingle="like"
        labelPlural="likes"
      />
    );
  }
}
