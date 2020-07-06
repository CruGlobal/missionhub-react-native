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

import { ACTIONS } from '../../../../constants';
import { RefreshControl } from '../../../../components/common';
import BottomButton from '../../../../components/BottomButton';
import { getCommunityUrl } from '../../../../utils/common';
import { ErrorNotice } from '../../../../components/ErrorNotice/ErrorNotice';
import CommunityMemberItem from '../../../../components/CommunityMemberItem';
import { organizationSelector } from '../../../../selectors/organizations';
import { removeGroupInviteInfo } from '../../../../actions/swipe';
import { trackActionWithoutData } from '../../../../actions/analytics';
import { navigateBack } from '../../../../actions/navigation';
import IconButton from '../../../../components/IconButton';
import Text from '../../../../components/Text';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { Organization } from '../../../../reducers/organizations';
import theme from '../../../../theme';
import { RootState } from '../../../../reducers';
import { FooterLoading } from '../../../../components/FooterLoading';
import { useMyId } from '../../../../utils/hooks/useIsMe';

import styles from './styles';
import { COMMUNITY_MEMBERS_QUERY } from './queries';
import {
  CommunityMembers as CommunityMembersQuery,
  CommunityMembersVariables,
} from './__generated__/CommunityMembers';

export const CommunityMembers = () => {
  const dispatch = useDispatch();
  const communityId: string = useNavigationParam('communityId');
  const myId = useMyId();

  const { data, error, fetchMore, refetch, loading } = useQuery<
    CommunityMembersQuery,
    CommunityMembersVariables
  >(COMMUNITY_MEMBERS_QUERY, { variables: { id: communityId } });

  const organization: Organization = useSelector(
    ({ organizations }: RootState) =>
      organizationSelector({ organizations }, { orgId: communityId }),
  );

  const groupInviteInfo = useSelector(
    ({ swipe }: RootState) => swipe.groupInviteInfo,
  );

  const myCommunityPermission = data?.community.people.edges.find(
    p => p.node.id === myId,
  )?.communityPermission;

  useAnalytics(['community', 'members'], {
    permissionType: { communityId },
  });
  const { t } = useTranslation('groupsMembers');

  const loadNextPage = async () => {
    if (!loading && data?.community.people.pageInfo.hasNextPage) {
      await fetchMore({
        variables: { after: data?.community.people.pageInfo.endCursor },
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
                    edges: [
                      ...(prev.community.people.edges || []),
                      ...(fetchMoreResult.community.people.edges || []),
                    ],
                  },
                },
              }
            : prev,
      });
    }
  };

  async function handleInvite() {
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
  }

  return (
    <View style={styles.container}>
      <StatusBar {...theme.statusBar.darkContent} />

      <FlatList
        testID="CommunityMemberList"
        initialNumToRender={12}
        data={data?.community.people.edges || []}
        keyExtractor={k => k.node.id}
        ListHeaderComponent={() => (
          <SafeAreaView>
            <Text style={styles.membersCount}>
              {t('communityHeader:memberCount', {
                count: data?.community.report.memberCount ?? 0,
              })}
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
            myCommunityPermission={myCommunityPermission}
            organization={organization}
            personOrgPermission={item.communityPermission}
            person={item.node}
            onRefreshMembers={refetch}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.2}
        ListFooterComponent={loading ? <FooterLoading /> : null}
      />
      <BottomButton
        onPress={handleInvite}
        text={t('invite')}
        testID="CommunityMemberInviteButton"
      />
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
            size={26}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export const COMMUNITY_MEMBERS = 'nav/COMMUNITY_MEMBERS';
