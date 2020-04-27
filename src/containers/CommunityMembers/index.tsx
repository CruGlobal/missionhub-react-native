import React, { useState, useEffect } from 'react';
import {
  Alert,
  Share,
  FlatList,
  View,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';

import {
  ACTIONS,
  ANALYTICS_PERMISSION_TYPE,
  DEFAULT_PAGE_LIMIT,
} from '../../constants';
import { RefreshControl } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import {
  getCommunityUrl,
  keyExtractorId,
  orgIsUserCreated,
  getPagination,
} from '../../utils/common';
import { getAnalyticsPermissionType } from '../../utils/analytics';
import CommunityMemberItem from '../../components/CommunityMemberItem';
import LoadMore from '../../components/LoadMore';
import { getOrganizationMembers } from '../../actions/organizations';
import { navToPersonScreen } from '../../actions/person';
import { organizationSelector } from '../../selectors/organizations';
import { removeGroupInviteInfo } from '../../actions/swipe';
import { trackActionWithoutData } from '../../actions/analytics';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW } from '../../routes/constants';
import IconButton from '../../components/IconButton';
import Text from '../../components/Text';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { Organization } from '../../reducers/organizations';
import { PaginationObject } from '../../reducers/organizations';
import theme from '../../theme';
import { RootState } from '../../reducers';

import styles from './styles';
import { COMMUNITY_MEMBERS_QUERY } from './queries';
import { CommunityMembers } from './__generated__/CommunityMembers';

export const CommunityMembersScreen = () => {
  const dispatch = useDispatch();
  const communityId: string = useNavigationParam('communityId');

  const {
    data: {
      community: {
        userCreated,
        people: {
          nodes = [],
          pageInfo: { endCursor = null, hasNextPage = false } = {},
        } = {},
        report: { memberCount } = {},
      } = {},
    } = {},
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery<CommunityMembers>(COMMUNITY_MEMBERS_QUERY, {
    variables: { id: communityId },
  });
  console.log('nodes', nodes);

  // const organization: Organization = useSelector(
  //   ({ organizations }: RootState) =>
  //     organizationSelector({ organizations }, { orgId }),
  // );

  // const groupInviteInfo = useSelector(
  //   ({ swipe }: RootState) => swipe.groupInviteInfo,
  // );

  // const analyticsPermissionType = useSelector(({ auth }: RootState) =>
  //   getAnalyticsPermissionType(auth, organization),
  // );
  // useAnalytics(['community', 'members'], {
  //   screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  // });
  const { t } = useTranslation('groupsMembers');

  // async function load() {
  // setPagination({ hasNextPage: true, page: 1 });
  // // TODO: Get org members sorted alphabetically
  // await dispatch(getOrganizationMembers(organization.id));
  // setPagination(
  //   getPagination(
  //     { meta: { total: 100 }, query: { page: { offset: 0 } } },
  //     members.length,
  //   ),
  // );
  // }
  const handleOnEndReached = async () => {
    // setPaging(true);
    console.log('paging...');
    try {
      await fetchMore({
        variables: { after: endCursor },
        updateQuery: (prev, { fetchMoreResult }) =>
          fetchMoreResult
            ? {
                ...prev,
                ...fetchMoreResult,
                community: {
                  ...prev.community,
                  ...fetchMoreResult.community,
                  people: {
                    ...prev.community.people,
                    ...fetchMoreResult.community.people,
                    nodes: [
                      ...(prev.community.people.nodes || []),
                      ...(fetchMoreResult.community.people.nodes || []),
                    ],
                  },
                },
              }
            : prev,
      });
    } catch (e) {
      // setPagingError(true);
    } finally {
      // setPaging(false);
    }
  };
  // useEffect(() => {
  //   load();
  // }, []);

  // async function handleInvite() {
  //   if (orgIsUserCreated(organization)) {
  //     const url = getCommunityUrl(organization.community_url);
  //     const code = organization.community_code;

  //     const { action } = await Share.share({
  //       message: t('sendInviteMessage', { url, code }),
  //     });
  //     if (action === Share.sharedAction) {
  //       dispatch(trackActionWithoutData(ACTIONS.SEND_COMMUNITY_INVITE));
  //       if (groupInviteInfo) {
  //         Alert.alert('', t('invited', { orgName: organization.name }));
  //         dispatch(removeGroupInviteInfo());
  //       }
  //     }
  //   } else {
  //     dispatch(
  //       navigatePush(ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW, {
  //         organization: organization.id ? organization : undefined,
  //       }),
  //     );
  //   }
  // }

  return (
    <View style={styles.container}>
      <StatusBar {...theme.statusBar.darkContent} />
      <FlatList
        data={[]}
        keyExtractor={keyExtractorId}
        ListHeaderComponent={() => (
          <SafeAreaView>
            <Text style={{}}>
              {/* TODO: Get the correct total number of members */}
              {memberCount} 24 members
            </Text>
          </SafeAreaView>
        )}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <></>
          // <CommunityMemberItem
          //   organization={organization}
          //   person={item}
          //   onSelect={person =>
          //     dispatch(navToPersonScreen(person, organization))
          //   }
          // />
        )}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={async () => {
              // try {
              //   setRefreshing(true);
              //   await load();
              // } finally {
              //   setRefreshing(false);
              // }
            }}
          />
        }
        // ListFooterComponent={
        // pagination.hasNextPage ? (
        //   <LoadMore onPress={loadNextPage} />
        // ) : (
        //   undefined
        // )
        // }
        onEndReachedThreshold={0.2}
        onEndReached={handleOnEndReached}
      />
      {/* <BottomButton onPress={handleInvite} text={t('invite')} /> */}
      <SafeAreaView style={styles.closeSafe}>
        <View style={styles.closeWrap}>
          <IconButton
            testID="CloseButton"
            hitSlop={theme.hitSlop(10)}
            buttonStyle={styles.closeButton}
            style={styles.close}
            onPress={() => dispatch(navigateBack())}
            name="close"
            type="Material"
            size={24}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommunityMembersScreen;
export const COMMUNITY_MEMBERS = 'nav/COMMUNITY_MEMBERS';
