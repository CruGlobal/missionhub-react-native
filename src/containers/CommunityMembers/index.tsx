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
import { AuthState } from '../../reducers/auth';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { OrganizationsState } from '../../reducers/organizations';
import { Organization } from '../../reducers/organizations';
import { SwipeState } from '../../reducers/swipe';
import { PaginationObject } from '../../reducers/organizations';
import theme from '../../theme';

import styles from './styles';

export const CommunityMembers = () => {
  const orgId = useNavigationParam('orgId');
  const [pagination, setPagination] = useState<PaginationObject>({
    hasNextPage: true,
    page: 1,
  });
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const organization = useSelector<
    { organizations: OrganizationsState },
    Organization
  >(({ organizations }) => organizationSelector({ organizations }, { orgId }));

  const groupInviteInfo = useSelector(
    ({ swipe }: { swipe: SwipeState }) => swipe.groupInviteInfo,
  );

  const analyticsPermissionType = useSelector(({ auth }: { auth: AuthState }) =>
    getAnalyticsPermissionType(auth, organization),
  );
  useAnalytics(['community', 'members'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });
  const members = organization.members || [];

  const { t } = useTranslation('groupsMembers');

  async function load() {
    setPagination({ hasNextPage: true, page: 1 });
    // TODO: Get org members sorted alphabetically
    await dispatch(getOrganizationMembers(organization.id));
    setPagination(
      getPagination(
        { meta: { total: 100 }, query: { page: { offset: 0 } } },
        members.length,
      ),
    );
  }
  async function loadNextPage() {
    const query = {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * pagination.page,
      },
    };
    const members = await dispatch(getOrganizationMembers(orgId, query));
    // TODO: Get the correct total number of members
    setPagination(
      getPagination({ meta: { total: 100 }, query }, members.length),
    );
  }
  useEffect(() => {
    load();
  }, []);

  async function handleInvite() {
    if (orgIsUserCreated(organization)) {
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
    <View style={{ flex: 1, backgroundColor: theme.extraLightGrey }}>
      <StatusBar {...theme.statusBar.darkContent} />
      <FlatList
        data={members}
        keyExtractor={keyExtractorId}
        ListHeaderComponent={() => (
          <SafeAreaView>
            <Text
              style={{
                marginTop: 15,
                marginBottom: 20,
                fontSize: 24,
                fontWeight: '300',
                lineHeight: 30,
                color: theme.grey,
              }}
            >
              {/* TODO: Get the correct total number of members */}
              24 members
            </Text>
          </SafeAreaView>
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90 }}
        renderItem={({ item }) => (
          <CommunityMemberItem
            organization={organization}
            person={item}
            onSelect={person =>
              dispatch(navToPersonScreen(person, organization))
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              try {
                setRefreshing(true);
                await load();
              } finally {
                setRefreshing(false);
              }
            }}
          />
        }
        ListFooterComponent={
          pagination.hasNextPage ? (
            <LoadMore onPress={loadNextPage} />
          ) : (
            undefined
          )
        }
      />
      <BottomButton onPress={handleInvite} text={t('invite')} />
      <SafeAreaView style={{ position: 'absolute', top: 0, right: 0 }}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <IconButton
            testID="CloseButton"
            hitSlop={theme.hitSlop(10)}
            buttonStyle={{ backgroundColor: theme.lightGrey, borderRadius: 25 }}
            style={{ margin: 5 }}
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

// // @ts-ignore
// @withTranslation('groupsMembers')
// class Members extends Component {
//   state = {
//     refreshing: false,
//   };

//   componentDidMount() {
//     // @ts-ignore
//     if (this.props.members.length === 0) {
//       this.load();
//     }
//   }

//   load = () => {
//     // @ts-ignore
//     const { dispatch, organization } = this.props;
//     dispatch(refreshCommunity(organization.id));
//     return dispatch(getOrganizationMembers(organization.id));
//   };

//   handleRefresh = () => {
//     refresh(this, this.load);
//   };

//   // @ts-ignore
//   handleSelect = person => {
//     // @ts-ignore
//     const { dispatch, organization } = this.props;
//     dispatch(navToPersonScreen(person, organization));
//   };

//   handleLoadMore = () => {
//     // @ts-ignore
//     const { dispatch, organization } = this.props;
//     dispatch(getOrganizationMembersNextPage(organization.id));
//   };

//   handleInvite = async () => {
//     // @ts-ignore
//     const { t, organization, groupInviteInfo, dispatch } = this.props;

//     if (orgIsUserCreated(organization)) {
//       const url = getCommunityUrl(organization.community_url);
//       const code = organization.community_code;

//       const { action } = await Share.share({
//         message: t('sendInviteMessage', { url, code }),
//       });
//       if (action === Share.sharedAction) {
//         dispatch(trackActionWithoutData(ACTIONS.SEND_COMMUNITY_INVITE));
//         if (groupInviteInfo) {
//           Alert.alert('', t('invited', { orgName: organization.name }));
//           dispatch(removeGroupInviteInfo());
//         }
//       }
//     } else {
//       dispatch(
//         navigatePush(ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW, {
//           organization: organization.id ? organization : undefined,
//         }),
//       );
//     }
//   };

//   // @ts-ignore
//   renderItem = ({ item }) => {
//     // @ts-ignore
//     const { organization, myOrgPermission } = this.props;
//     return (
//       <GroupMemberItem
//         organization={organization}
//         person={item}
//         myOrgPermission={myOrgPermission}
//         onSelect={this.handleSelect}
//       />
//     );
//   };

//   renderHeader = () => <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />;

//   render() {
//     // @ts-ignore
//     const { t, members, pagination, analyticsPermissionType } = this.props;
//     return (
//       <View style={styles.cardList}>
//         <Analytics
//           screenName={['community', 'members']}
//           screenContext={{
//             [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
//           }}
//         />
//         <FlatList
//           data={members}
//           ListHeaderComponent={this.renderHeader}
//           keyExtractor={keyExtractorId}
//           contentContainerStyle={{ paddingBottom: 90 }}
//           renderItem={this.renderItem}
//           refreshControl={
//             <RefreshControl
//               refreshing={this.state.refreshing}
//               onRefresh={this.handleRefresh}
//             />
//           }
//           ListFooterComponent={
//             pagination.hasNextPage ? (
//               <LoadMore onPress={this.handleLoadMore} />
//             ) : (
//               undefined
//             )
//           }
//         />
//         <BottomButton onPress={this.handleInvite} text={t('invite')} />
//       </View>
//     );
//   }
// }

// // @ts-ignore
// Members.propTypes = {
//   organization: PropTypes.object.isRequired,
// };

// // @ts-ignore
// const mapStateToProps = ({ auth, organizations, swipe }, { orgId }) => {
//   const organization = organizationSelector({ organizations }, { orgId });
//   const myOrgPermission = orgPermissionSelector(
//     {},
//     {
//       person: auth.person,
//       organization,
//     },
//   );

//   return {
//     groupInviteInfo: swipe.groupInviteInfo,
//     members: organization.members || [],
//     pagination: organizations.membersPagination,
//     myOrgPermission,
//     organization,
//     analyticsPermissionType: getAnalyticsPermissionType(auth, organization),
//   };
// };

export default CommunityMembers;
export const COMMUNITY_MEMBERS = 'nav/COMMUNITY_MEMBERS';
