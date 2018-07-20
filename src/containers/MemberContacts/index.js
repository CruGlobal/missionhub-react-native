import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import NullStateComponent from '../../components/NullStateComponent';

@translate('memberContacts')
class MemberContacts extends Component {
  renderEmpty() {
    const { t, person } = this.props;

    return (
      <NullStateComponent
        imageSource={null}
        headerText={t('peopleScreen:header')}
        descriptionText={t('nullDescription', {
          memberName: person.first_name,
        })}
      />
    );
  }

  render() {
    return this.renderEmpty();
  }
}

MemberContacts.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect()(MemberContacts);
