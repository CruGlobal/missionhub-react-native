import React, { Component } from 'react';
import { Alert, Share, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, RefreshControl, Button } from '../../components/common';
import { refresh, isAdminOrOwner, getCommunityUrl } from '../../utils/common';
import GroupMemberItem from '../../components/GroupMemberItem';
import LoadMore from '../../components/LoadMore';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../actions/organizations';
import { navToPersonScreen } from '../../actions/person';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { removeGroupInviteInfo } from '../../actions/swipe';

import styles from './styles';
import OnboardingCard, { GROUP_ONBOARDING_TYPES } from './OnboardingCard';

@translate('groupsMembers')
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

  keyExtractor = i => i.id;

  handleInvite = async () => {
    const { t, organization, groupInviteInfo, dispatch } = this.props;
    const url = getCommunityUrl(organization.community_url);
    const { action } = await Share.share({
      message: t('sendInviteMessage', { url }),
    });
    if (groupInviteInfo && action === Share.sharedAction) {
      Alert.alert('', t('invited', { orgName: organization.name }));
      dispatch(removeGroupInviteInfo());
    }
  };

  renderItem = ({ item }) => {
    const { organization, myOrgPermission, myId } = this.props;
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
    const { t, members, pagination, myOrgPermission } = this.props;
    return (
      <Flex value={1}>
        <FlatList
          data={members}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={this.keyExtractor}
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
        {isAdminOrOwner(myOrgPermission) ? (
          <Flex align="stretch" justify="end">
            <Button
              type="secondary"
              onPress={this.handleInvite}
              text={t('invite').toUpperCase()}
            />
          </Flex>
        ) : null}
      </Flex>
    );
  }
}

Members.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, organizations, swipe }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );
  return {
    groupInviteInfo: swipe.groupInviteInfo,
    members: (selectorOrg || {}).members || [],
    pagination: organizations.membersPagination,
    myOrgPermission: orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: organization.id },
    }),
  };
};

export default connect(mapStateToProps)(Members);
