import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, RefreshControl } from '../../components/common';
import { refresh } from '../../utils/common';
import GroupMemberItem from '../../components/GroupMemberItem';
import LoadMore from '../../components/LoadMore';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../actions/organizations';
import { navToPersonScreen } from '../../actions/person';
import { organizationSelector } from '../../selectors/organizations';

import styles from './styles';

@translate('groupsMembers')
class ChallengeMembers extends Component {
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

  render() {
    const { t, members, pagination } = this.props;
    return (
      <Flex value={1}>
        <FlatList
          data={members}
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
      </Flex>
    );
  }
}

ChallengeMembers.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );
  return {
    members: (selectorOrg || {}).members || [],
    pagination: organizations.membersPagination,
  };
};

export default connect(mapStateToProps)(ChallengeMembers);
