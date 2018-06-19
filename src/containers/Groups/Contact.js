import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { PlatformKeyboardAvoidingView } from '../../components/common';
import GroupsContactList from '../../components/GroupsContactList';
import CommentBox from '../../components/CommentBox';
import Header from '../Header';
import BackButton from '../BackButton';

import styles from './styles';

@translate('groupsContact')
class Contact extends Component {
  submit = data => {
    return data;
  };
  handleAssign = () => {
    return true;
  };

  render() {
    const { t, organization, activity, person } = this.props;
    const orgName = organization ? organization.name : undefined;
    return (
      <PlatformKeyboardAvoidingView style={styles.contact}>
        <Header left={<BackButton />} title={orgName} shadow={false} />
        <GroupsContactList
          activity={activity}
          person={person}
          onAssign={this.handleAssign}
        />
        <CommentBox placeholder={t('placeholder')} onSubmit={this.submit} />
      </PlatformKeyboardAvoidingView>
    );
  }
}

Contact.propTypes = {
  organization: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
  activity: [
    {
      id: '1',
      created_at: '2018-05-29T17:02:02Z',
      text: 'Someone had a spiritual conversation',
      comment: 'Some comment',
      type: 'interaction',
      interaction_type_id: 2,
    },
    {
      id: '2',
      created_at: '2018-05-29T17:02:02Z',
      text: 'Someone else had a spiritual conversation',
      comment: '',
      type: 'interaction',
      interaction_type_id: 2,
    },
    {
      id: '3',
      created_at: '2018-05-29T17:02:02Z',
      text: 'Someone else had a gospel conversation',
      comment: '',
      type: 'interaction',
      interaction_type_id: 3,
    },
    {
      id: '4',
      created_at: '2018-05-29T17:02:02Z',
      text: 'Someone else had a spiritual conversation',
      comment: '',
    },
    {
      id: '5',
      created_at: '2018-05-29T17:02:02Z',
      text: 'Someone else had a spiritual conversation',
      comment: '',
    },
  ],
});

export default connect(mapStateToProps)(Contact);
export const GROUPS_CONTACT = 'nav/GROUPS_CONTACT';
