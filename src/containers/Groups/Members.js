import React, { Component } from 'react';
import { SafeAreaView, Alert, Share, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { ACTIONS } from '../../constants';
import { RefreshControl } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import {
  refresh,
  getCommunityUrl,
  keyExtractorId,
  orgIsUserCreated,
} from '../../utils/common';
import GroupMemberItem from '../../components/GroupMemberItem';
import LoadMore from '../../components/LoadMore';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
  refreshCommunity,
} from '../../actions/organizations';
import { navToPersonScreen } from '../../actions/person';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { removeGroupInviteInfo } from '../../actions/swipe';
import { trackActionWithoutData } from '../../actions/analytics';
import { navigatePush } from '../../actions/navigation';
import { ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW } from '../../routes/constants';

import styles from './styles';
import OnboardingCard, { GROUP_ONBOARDING_TYPES } from './OnboardingCard';

@withTranslation('groupsMembers')
class Members extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    if (this.props.members.length === 0) {
      this.load();
    }
  }

  load = () => {
    const { dispatch, organization } = this.props;
    dispatch(refreshCommunity(organization.id));
    return dispatch(getOrganizationMembers(organization.id));
  };

  handleRefresh = () => {
    refresh(this, this.load);
  };

  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(navToPersonScreen(person, organization));
  };

  handleLoadMore = () => {
    const { dispatch, organization } = this.props;
    dispatch(getOrganizationMembersNextPage(organization.id));
  };

  handleInvite = async () => {
    const { t, organization, groupInviteInfo, dispatch } = this.props;

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
  };

  renderItem = ({ item }) => {
    const { organization, myOrgPermission } = this.props;
    return (
      <GroupMemberItem
        organization={organization}
        person={item}
        myOrgPermission={myOrgPermission}
        onSelect={this.handleSelect}
      />
    );
  };

  renderHeader = () => <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />;

  render() {
    const { t, members, pagination } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={members}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={keyExtractorId}
          style={styles.cardList}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          ListFooterComponent={
            pagination.hasNextPage ? (
              <LoadMore onPress={this.handleLoadMore} />
            ) : (
              undefined
            )
          }
        />
        <BottomButton onPress={this.handleInvite} text={t('invite')} />
      </SafeAreaView>
    );
  }
}

Members.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = (
  { auth, organizations, swipe },
  { organization = {} },
) => {
  const orgId = organization.id;
  const selectorOrg =
    organizationSelector({ organizations }, { orgId }) || organization;
  return {
    groupInviteInfo: swipe.groupInviteInfo,
    members: selectorOrg.members || [],
    pagination: organizations.membersPagination,
    myOrgPermission: orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: orgId },
    }),
    organization: selectorOrg,
  };
};

export default connect(mapStateToProps)(Members);
