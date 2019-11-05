import React, { useEffect, useRef } from 'react';
import { ScrollView, FlatList, SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Header from '../../components/Header';
import GroupCardItem from '../../components/GroupCardItem';
import { IconButton, RefreshControl, Button } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { trackActionWithoutData } from '../../actions/analytics';
import { openMainMenu, keyExtractorId } from '../../utils/common';
import { navigateToOrg } from '../../actions/organizations';
import { resetScrollGroups } from '../../actions/swipe';
import { ACTIONS, GROUPS_TAB, GLOBAL_COMMUNITY_ID } from '../../constants';
import {
  CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
} from '../../routes/constants';
import TrackTabChange from '../TrackTabChange';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { SwipeState } from '../../reducers/swipe';
import { AuthState } from '../../reducers/auth';

import styles from './styles';
import { CREATE_GROUP_SCREEN } from './CreateGroupScreen';
import {
  GetCommunities,
  GetCommunities_communities_nodes,
} from './__generated__/GetCommunities';

export const GET_COMMUNITIES_QUERY = gql`
  query GetCommunities {
    globalCommunity {
      usersReport {
        usersCount
      }
    }
    communities(ministryActivitiesOnly: true, sortBy: name_ASC) {
      nodes {
        id
        name
        unreadCommentsCount
        userCreated
        communityPhotoUrl
        people(permissions: [owner]) {
          nodes {
            id
            firstName
            lastName
          }
        }
        report(period: "P1W") {
          contactCount
          memberCount
          unassignedCount
        }
      }
    }
  }
`;

interface GroupsListScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  isFirstTime?: boolean;
  scrollToId?: string | null;
}

const GroupsListScreen = ({
  dispatch,
  isFirstTime,
  scrollToId,
}: GroupsListScreenProps) => {
  const { t } = useTranslation('groupsList');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatList = useRef<FlatList<any>>(null);

  const {
    data: {
      globalCommunity: { usersReport: { usersCount = 0 } = {} } = {},
      communities: { nodes = [] } = {},
    } = {},
    refetch: refetchCommunities,
  } = useQuery<GetCommunities>(GET_COMMUNITIES_QUERY);

  const globalCommunity: GetCommunities_communities_nodes = {
    __typename: 'Community',
    id: GLOBAL_COMMUNITY_ID,
    name: t('globalCommunity'),
    unreadCommentsCount: 0,
    userCreated: true,
    communityPhotoUrl: null,
    people: { __typename: 'PersonConnection', nodes: [] },
    report: {
      __typename: 'CommunitiesReport',
      contactCount: 0,
      unassignedCount: 0,
      memberCount: usersCount,
    },
  };

  const communities: GetCommunities_communities_nodes[] = [
    globalCommunity,
    ...nodes,
  ];

  useEffect(() => {
    function loadGroupsAndScrollToId() {
      // Always load groups when this tab mounts
      if (scrollToId) {
        const index = communities.findIndex(o => o.id === scrollToId);
        if (index >= 0 && flatList.current) {
          try {
            flatList.current.scrollToIndex({
              animated: true,
              index,
              // Put the new org in the top of the list if already there or the center
              viewPosition: index === 0 ? 0 : 0.5,
            });
          } catch (e) {}
        }
        dispatch(resetScrollGroups());
      }
    }

    loadGroupsAndScrollToId();
  }, [communities, scrollToId, flatList]);

  const { isRefreshing, refresh } = useRefreshing(() => {
    refetchCommunities();
  });

  const handlePress = (community: GetCommunities_communities_nodes) => {
    dispatch(navigateToOrg(community.id));
    dispatch(trackActionWithoutData(ACTIONS.SELECT_COMMUNITY));
  };
  const dispatchOpenMainMenu = () => {
    dispatch(openMainMenu());
  };
  const join = () => {
    dispatch(navigatePush(JOIN_BY_CODE_FLOW));
  };
  const create = () => {
    dispatch(
      navigatePush(
        isFirstTime
          ? CREATE_COMMUNITY_UNAUTHENTICATED_FLOW
          : CREATE_GROUP_SCREEN,
      ),
    );
  };

  const renderItem = ({ item }: { item: GetCommunities_communities_nodes }) => (
    <GroupCardItem testID="GroupCard" group={item} onPress={handlePress} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TrackTabChange screen={GROUPS_TAB} />
      <Header
        left={
          <IconButton
            testID="IconButton"
            name="menuIcon"
            type="MissionHub"
            onPress={dispatchOpenMainMenu}
          />
        }
        title={t('header').toUpperCase()}
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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        <FlatList
          testID="FlatList"
          ref={flatList}
          data={communities}
          keyExtractor={keyExtractorId}
          renderItem={renderItem}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({
  auth,
  swipe,
}: {
  auth: AuthState;
  swipe: SwipeState;
}) => ({
  isFirstTime: auth.isFirstTime,
  scrollToId: swipe.groupScrollToId,
});

export default connect(mapStateToProps)(GroupsListScreen);
