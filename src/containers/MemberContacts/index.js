import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import NULL from '../../../assets/images/MemberContacts.png';
import NullStateComponent from '../../components/NullStateComponent';
import GroupMemberItem from '../../components/GroupMemberItem';

@translate('memberContacts')
class MemberContacts extends Component {
  state = { refreshing: false };

  renderItem = ({ item }) => <GroupMemberItem person={item.person} />;

  renderList() {
    const { contactAssignments } = this.props;

    return (
      <FlatList
        data={contactAssignments}
        keyExtractor={p => p.id}
        renderItem={this.renderItem}
      />
    );
  }

  renderEmpty() {
    const { t, person } = this.props;

    return (
      <NullStateComponent
        imageSource={NULL}
        headerText={t('peopleScreen:header')}
        descriptionText={t('nullDescription', {
          memberName: person.first_name,
        })}
      />
    );
  }

  render() {
    const { contactAssignments } = this.props;

    return contactAssignments.length > 0
      ? this.renderList()
      : this.renderEmpty();
  }
}

MemberContacts.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (_, { person }) => ({
  contactAssignments: person.contact_assignments
    ? person.contact_assignments.filter(c => c.person)
    : [],
});

export default connect(mapStateToProps)(MemberContacts);
