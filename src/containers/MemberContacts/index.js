import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import NULL from '../../../assets/images/MemberContacts.png';
import NullStateComponent from '../../components/NullStateComponent';
import PersonListItem from '../../components/PersonListItem';
import { personSelector } from '../../selectors/people';
import { keyExtractorId } from '../../utils/common';

import styles from './styles';

@withTranslation('memberContacts')
class MemberContacts extends Component {
  state = { refreshing: false };

  renderItem = ({ item }) => {
    const { organization } = this.props;
    return <PersonListItem person={item.person} organization={organization} />;
  };

  renderList() {
    const { contactAssignments } = this.props;

    return (
      <FlatList
        data={contactAssignments}
        keyExtractor={keyExtractorId}
        renderItem={this.renderItem}
        style={styles.flatList}
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
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ people }, { person, organization }) => {
  const currentPerson = personSelector(
    { people },
    { personId: person.id, orgId: organization.id },
  );

  return currentPerson
    ? {
        contactAssignments: currentPerson.contact_assignments
          ? currentPerson.contact_assignments.filter(
              c =>
                c &&
                c.person &&
                c.organization &&
                c.organization.id === organization.id,
            )
          : [],
      }
    : {
        contactAssignments: [],
      };
};

export default connect(mapStateToProps)(MemberContacts);
