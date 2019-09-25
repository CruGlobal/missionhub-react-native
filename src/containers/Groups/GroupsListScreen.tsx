import React, { useEffect, useRef } from 'react';
import { ScrollView, FlatList, SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import Header from '../../components/Header';
import GroupCardItem from '../../components/GroupCardItem';
import { IconButton, RefreshControl, Button } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { trackActionWithoutData } from '../../actions/analytics';
import { openMainMenu, keyExtractorId } from '../../utils/common';
import NullMemberImage from '../../../assets/images/MemberContacts.png';
import NullStateComponent from '../../components/NullStateComponent';
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
import { Organization } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';
import theme from '../../theme';

import styles from './styles';
import { CREATE_GROUP_SCREEN } from './CreateGroupScreen';
import { CommunitiesList } from './__generated__/CommunitiesList';

export const COMMUNITIES_QUERY = gql`
  query CommunitiesList {
    communities(ministryActivitiesOnly: true, sortBy: name_ASC) {
      nodes {
        id
        name
        unreadCommentsCount
        userCreated
        communityPhotoUrl
        people(permissions: [owner, no_permissions]) {
          id
          fullName
        }
      }
    }
  }
`;

const GroupsListScreen = ({
  dispatch,
  isFirstTime,
  scrollToId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  isFirstTime?: boolean;
  scrollToId?: string | number | null;
}) => {
  const { t } = useTranslation('groupsList');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatList = useRef<FlatList<any>>(null);

  const globalCommunity = {
    id: GLOBAL_COMMUNITY_ID,
    name: t('globalCommunity'),
    community: true,
    user_created: true,
  };

  const { data: { communities: { nodes = [] } = {} } = {}, refetch } = useQuery<
    CommunitiesList
  >(COMMUNITIES_QUERY);
  const communities = [globalCommunity, ...nodes];

  useEffect(() => {
    refetch();
  }, []);

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

  const { isRefreshing, refresh } = useRefreshing(refetch);

  const handlePress = (organization: Organization) => {
    dispatch(navigateToOrg(organization.id));
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

  const renderItem = ({ item }: { item: object }) => (
    <GroupCardItem group={item} onPress={handlePress} />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.primaryColor }}>
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
            type="transparent"
            style={[styles.blockBtn, styles.blockBtnBorderRight]}
            buttonTextStyle={styles.blockBtnText}
            text={t('joinCommunity').toUpperCase()}
            onPress={join}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            type="transparent"
            style={styles.blockBtn}
            buttonTextStyle={styles.blockBtnText}
            text={t('createCommunity').toUpperCase()}
            onPress={create}
          />
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        {communities.length > 0 ? (
          <FlatList
            testID="FlatList"
            ref={flatList}
            style={styles.cardList}
            data={communities}
            keyExtractor={keyExtractorId}
            renderItem={renderItem}
          />
        ) : (
          <NullStateComponent
            imageSource={NullMemberImage}
            headerText={t('header').toUpperCase()}
            descriptionText={t('groupsNull')}
          />
        )}
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
