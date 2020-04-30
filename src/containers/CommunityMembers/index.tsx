import React from 'react';
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

import { ACTIONS, ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { RefreshControl } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { getCommunityUrl, keyExtractorId } from '../../utils/common';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { getAnalyticsPermissionType } from '../../utils/analytics';
import CommunityMemberItem from '../../components/CommunityMemberItem';
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
import theme from '../../theme';
import { RootState } from '../../reducers';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import LoadMore from '../../components/LoadMore';

import styles from './styles';
import { COMMUNITY_MEMBERS_QUERY } from './queries';
import { CommunityMembers } from './__generated__/CommunityMembers';

export const CommunityMembersScreen = () => {
  const dispatch = useDispatch();
  const communityId: string = useNavigationParam('communityId');

  const {
    data: {
      community: {
        userCreated = false,
        people: {
          nodes = [],
          pageInfo: { endCursor = null, hasNextPage = false } = {},
        } = {},
        report: { memberCount = 0 } = {},
      } = {},
    } = {},
    error,
    fetchMore,
    refetch,
  } = useQuery<CommunityMembers>(COMMUNITY_MEMBERS_QUERY, {
    variables: { id: communityId },
  });
  const { isRefreshing, refresh } = useRefreshing(refetch);

  const organization: Organization = useSelector(
    ({ organizations }: RootState) =>
      organizationSelector({ organizations }, { orgId: communityId }),
  );

  const groupInviteInfo = useSelector(
    ({ swipe }: RootState) => swipe.groupInviteInfo,
  );

  const analyticsPermissionType = useSelector(({ auth }: RootState) =>
    getAnalyticsPermissionType(auth, organization),
  );
  useAnalytics(['community', 'members'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });
  const { t } = useTranslation('groupsMembers');

  const loadNextPage = async () => {
    if (hasNextPage) {
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
    }
  };

  async function handleInvite() {
    if (userCreated) {
      const url = getCommunityUrl(organization.community_url);
      const code = organization.community_code;

      const { action } = await Share.share({
        message: t('sendInviteMessage', { url, code }),
      });
      if (action === Share.sharedAction) {
        dispatch(trackActionWithoutData(ACTIONS.SEND_COMMUNITY_INVITE));
        if (groupInviteInfo) {
          Alert.alert('', t('invited', { orgName: organization.name }));
          dispatch(removeGroupInviteInfo());
        }
      }
    } else {
      dispatch(
        navigatePush(ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW, {
          organization: organization.id ? organization : undefined,
        }),
      );
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar {...theme.statusBar.darkContent} />

      <FlatList
        data={nodes}
        keyExtractor={keyExtractorId}
        ListHeaderComponent={() => (
          <SafeAreaView>
            <Text style={styles.membersCount}>
              {t('communityHeader:memberCount', { count: memberCount ?? 0 })}
            </Text>
            <ErrorNotice
              message={t('errorLoadingMembers')}
              error={error}
              refetch={refetch}
            />
          </SafeAreaView>
        )}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CommunityMemberItem
            organization={organization}
            personOrgPermission={item.communityPermissions.nodes[0]}
            person={item}
            onSelect={person =>
              dispatch(navToPersonScreen(person, organization))
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        ListFooterComponent={
          hasNextPage ? <LoadMore onPress={loadNextPage} /> : undefined
        }
      />
      <BottomButton onPress={handleInvite} text={t('invite')} />
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
