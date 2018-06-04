import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { Flex } from '../../components/common';
import GroupMemberItem from '../../components/GroupMemberItem';
import LoadMore from '../../components/LoadMore';
import {
  getOrganizationMembers,
  getOrganizationMembersNextPage,
} from '../../actions/organizations';

import styles from './styles';
import { GROUPS_CONTACT } from './Contact';

@translate('groupsMembers')
class Members extends Component {
  componentDidMount() {
    const { dispatch, organization } = this.props;
    dispatch(getOrganizationMembers(organization.id));
  }

  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_CONTACT, { organization, person }));
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

const mapStateToProps = ({ groups }, { organization }) => ({
  members: groups.members[organization.id] || [],
  pagination: groups.membersPagination,
});

export default connect(mapStateToProps)(Members);
