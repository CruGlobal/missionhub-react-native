import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { TFunction } from 'i18next';

import Header from '../../components/Header';
import GroupCardItem from '../../components/GroupCardItem';
import { GroupCardHeight } from '../../components/GroupCardItem/styles';
import { CardVerticalMargin } from '../../components/Card/styles';
import { Button } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { trackActionWithoutData } from '../../actions/analytics';
import { keyExtractorId } from '../../utils/common';
import { resetScrollGroups } from '../../actions/swipe';
import { ACTIONS, GLOBAL_COMMUNITY_ID } from '../../constants';
import {
  CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
  JOIN_COMMUNITY_UNAUTHENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
} from '../../routes/constants';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../utils/hooks/useAnalytics';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { COMMUNITY_TABS } from '../Communities/Community/constants';
import AvatarMenuButton from '../../components/AvatarMenuButton';
import { useIsAnonymousUser } from '../../auth/authHooks';
import { RootState } from '../../reducers';

import styles from './styles';
import { CREATE_GROUP_SCREEN } from './CreateGroupScreen';
import {
  GetCommunities,
  GetCommunities_communities_nodes,
} from './__generated__/GetCommunities';
import { GET_COMMUNITIES_QUERY } from './queries';

const createGlobalCommunity = (t: TFunction, usersCount: number) =>
  ({
    __typename: 'Community',
    id: GLOBAL_COMMUNITY_ID,
    name: t('globalCommunity'),
    unreadCommentsCount: 0,
    communityPhotoUrl: null,
    owner: { __typename: 'CommunityPersonConnection', nodes: [] },
    report: {
      __typename: 'CommunitiesReport',
      contactCount: 0,
      unassignedCount: 0,
      memberCount: usersCount,
    },
  } as GetCommunities_communities_nodes);

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const getItemLayout = (_: unknown, index: number) => {
  const ItemHeight = GroupCardHeight + CardVerticalMargin * 2;
  return { length: ItemHeight, offset: ItemHeight * index, index };
};

const GroupsListScreen = () => {
  useAnalytics('communities', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
  const dispatch = useDispatch();
  const { t } = useTranslation('groupsList');

  const scrollToId = useSelector(
    ({ swipe }: RootState) => swipe.groupScrollToId,
  );
  const isAnonymousUser = useIsAnonymousUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatList = useRef<FlatList<any>>(null);
  const [overflowBottom, setOverflowBottom] = useState(false);
  const [paging, setPaging] = useState(false);
  const [pagingError, setPagingError] = useState(false);

  const {
    data: {
      globalCommunity: { usersReport: { usersCount = 0 } = {} } = {},
      communities: {
        nodes = [],
        pageInfo: { endCursor = null, hasNextPage = true } = {},
      } = {},
    } = {},
    fetchMore,
    refetch,
    error,
  } = useQuery<GetCommunities>(GET_COMMUNITIES_QUERY);

  const globalCommunity = createGlobalCommunity(t, usersCount);
  const communities: GetCommunities_communities_nodes[] = [
    globalCommunity,
    ...nodes,
  ];

  const { isRefreshing, refresh } = useRefreshing(refetch);

  const handleNextPage = async () => {
    setPaging(true);
    try {
      await fetchMore({
        variables: { communityCursor: endCursor },
        updateQuery: (prev, { fetchMoreResult }) =>
          fetchMoreResult
            ? {
                ...prev,
                ...fetchMoreResult,
                communities: {
                  ...prev.communities,
                  ...fetchMoreResult.communities,
                  nodes: [
                    ...(prev.communities.nodes || []),
                    ...(fetchMoreResult.communities.nodes || []),
                  ],
                },
              }
            : prev,
      });
    } catch (e) {
      setPagingError(true);
    } finally {
      setPaging(false);
    }
  };

  useEffect(() => {
    function loadGroupsAndScrollToId() {
      // Always load groups when this tab mounts
      if (!scrollToId || !communities || !flatList.current) {
        return;
      }

      const index = communities.findIndex(o => o.id === scrollToId);

      if (index < 0) {
        return;
      }

      try {
        flatList.current.scrollToIndex({
          index,
          viewPosition: index === 0 ? 0 : 0.5,
        });
      } catch (e) {}

      dispatch(resetScrollGroups());
    }

    loadGroupsAndScrollToId();
  }, [communities, scrollToId, flatList]);

  const handlePress = (community: GetCommunities_communities_nodes) => {
    dispatch(
      navigatePush(COMMUNITY_TABS, {
        communityId: community.id,
      }),
    );
    dispatch(trackActionWithoutData(ACTIONS.SELECT_COMMUNITY));
  };

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const closeToBottom = isCloseToBottom(nativeEvent);

    if (closeToBottom) {
      if (!overflowBottom && !paging && !pagingError && hasNextPage) {
        handleNextPage();
      }
    } else {
      setPagingError(false);
    }

    setOverflowBottom(closeToBottom);
  };

  const join = () => {
    dispatch(
      navigatePush(
        isAnonymousUser
          ? JOIN_COMMUNITY_UNAUTHENTICATED_FLOW
          : JOIN_BY_CODE_FLOW,
      ),
    );
  };

  const create = () => {
    dispatch(
      navigatePush(
        isAnonymousUser
          ? CREATE_COMMUNITY_UNAUTHENTICATED_FLOW
          : CREATE_GROUP_SCREEN,
      ),
    );
  };

  const renderItem = ({ item }: { item: GetCommunities_communities_nodes }) => (
    <GroupCardItem testID="GroupCard" group={item} onPress={handlePress} />
  );

  return (
    <View style={styles.container}>
      <Header
        titleStyle={styles.headerTitle}
        left={<AvatarMenuButton />}
        title={t('header')}
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Button
            testID="joinCommunity"
            type="transparent"
            style={[styles.blockBtn, styles.blockBtnBorderRight]}
            buttonTextStyle={styles.blockBtnText}
            text={t('joinCommunity').toUpperCase()}
            onPress={join}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            testID="createCommunity"
            type="transparent"
            style={styles.blockBtn}
            buttonTextStyle={styles.blockBtnText}
            text={t('createCommunity').toUpperCase()}
            onPress={create}
          />
        </View>
      </View>
      <ErrorNotice
        message={t('errorLoadingCommunities')}
        error={error}
        refetch={refetch}
      />
      <FlatList
        testID="flatList"
        refreshing={isRefreshing}
        onRefresh={refresh}
        onScroll={handleScroll}
        getItemLayout={getItemLayout}
        style={styles.scrollView}
        ref={flatList}
        data={communities}
        keyExtractor={keyExtractorId}
        renderItem={renderItem}
      />
    </View>
  );
};

export default GroupsListScreen;
