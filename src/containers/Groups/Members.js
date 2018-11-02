import React, { Component } from 'react';
import { Share, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, RefreshControl, Button } from '../../components/common';
import { refresh } from '../../utils/common';
import GroupMemberItem from '../../components/GroupMemberItem';
import LoadMore from '../../components/LoadMore';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../actions/organizations';
import { navToPersonScreen } from '../../actions/person';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { ORG_PERMISSIONS } from '../../constants';

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

  handleInvite = () => {
    const { t } = this.props;
    const url = `https://www.missionhub.com/join/${'123456'}`;
    Share.share({ message: t('sendInviteMessage', { url }) });
  };

  renderItem = ({ item }) => {
    const { organization } = this.props;
    return (
      <GroupMemberItem
        isUserCreatedOrg={organization.user_created}
        person={item}
        onSelect={this.handleSelect}
      />
    );
  };

  renderHeader = () => <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />;

  render() {
    const { t, members, pagination, myOrgPermissions } = this.props;
    return (
      <Flex value={1}>
        <FlatList
          data={members}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={this.keyExtractor}
          style={styles.flatList}
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
        {myOrgPermissions &&
        myOrgPermissions.permission_id === ORG_PERMISSIONS.ADMIN ? (
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

const mapStateToProps = ({ auth, organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );
  return {
    members: (selectorOrg || {}).members || [],
    pagination: organizations.membersPagination,
    myOrgPermissions: orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: organization.id },
    }),
  };
};

export default connect(mapStateToProps)(Members);
