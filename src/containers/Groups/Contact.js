import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, Button } from '../../components/common';
import GroupsContactList from '../../components/GroupsContactList';
import Header from '../Header';
import BackButton from '../BackButton';

@connect()
@translate('groupsContact')
class Contact extends Component {
  handleAssign = () => {
    LOG('handle assign');
    return true;
  };

  render() {
    const { organization, activity, person } = this.props;
    const orgName = organization ? organization.name : undefined;
    return (
      <Flex value={1}>
        <Header left={<BackButton />} title={orgName} shadow={false} />
        <GroupsContactList
          activity={activity}
          person={person}
          onAssign={this.handleAssign}
        />
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={() => {}}
            text={'Input goes here'}
          />
        </Flex>
      </Flex>
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
