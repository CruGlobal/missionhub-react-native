import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { MEMBER_PERSON_SCREEN } from '../PersonScreen/MemberPersonScreen';
import { navigatePush } from '../../actions/navigation';
import { Flex, RefreshControl } from '../../components/common';
import { refresh } from '../../utils/common';
import GroupMemberItem from '../../components/GroupMemberItem';
import LoadMore from '../../components/LoadMore';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';

import styles from './styles';

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
    dispatch(navigatePush(MEMBER_PERSON_SCREEN, { organization, person }));
  };

  handleLoadMore = () => {
    const { dispatch, organization } = this.props;
    dispatch(getOrganizationMembersNextPage(organization.id));
  };

  render() {
    const { members, pagination } = this.props;
    return (
      <Flex value={1} style={styles.members}>
        <FlatList
          data={members}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <GroupMemberItem person={item} onSelect={this.handleSelect} />
          )}
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

Members.propTypes = {
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

export default connect(mapStateToProps)(Members);
