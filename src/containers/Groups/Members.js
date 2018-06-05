import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { Flex } from '../../components/common';
import GroupMemberItem from '../../components/GroupMemberItem';
import LoadMore from '../../components/LoadMore';

import styles from './styles';
import { GROUPS_CONTACT } from './Contact';

@translate('groupsMembers')
class Members extends Component {
  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_CONTACT, { organization, person }));
  };

  handleLoadMore = () => {
    return true;
  };

  render() {
    const { members, hasMore } = this.props;
    return (
      <Flex value={1}>
        <FlatList
          data={members}
          keyExtractor={i => i.id}
          style={styles.flatList}
          renderItem={({ item }) => (
            <GroupMemberItem person={item} onSelect={this.handleSelect} />
          )}
          ListFooterComponent={
            hasMore ? <LoadMore onPress={this.handleLoadMore} /> : undefined
          }
        />
      </Flex>
    );
  }
}

Members.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
  members: [
    { id: '123', full_name: 'Full Name1', assignedNum: 2, uncontactedNum: 3 },
    { id: '223', full_name: 'Full Name2', assignedNum: 2, uncontactedNum: 0 },
    { id: '323', full_name: 'Full Name3', assignedNum: 12, uncontactedNum: 2 },
  ],
  hasMore: true,
});

export default connect(mapStateToProps)(Members);
