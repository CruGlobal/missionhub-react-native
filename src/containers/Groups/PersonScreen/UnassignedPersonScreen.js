import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { getGroupJourney } from '../../../actions/journey';
import { PlatformKeyboardAvoidingView } from '../../../components/common';
import { INTERACTION_TYPES } from '../../../constants';
import { addNewInteraction } from '../../../actions/interactions';
import { createContactAssignment } from '../../../actions/person';
import GroupsContactList from '../../../components/GroupsContactList';
import CommentBox from '../../../components/CommentBox';
import Header from '../../Header';
import BackButton from '../../BackButton';

import styles from './styles';

@translate('groupsContact')
class UnassignedPersonScreen extends Component {
  state = { activity: [] };

  componentDidMount() {
    this.loadFeed();
  }

  loadFeed = async () => {
    const { dispatch, person, organization } = this.props;
    const results = await dispatch(getGroupJourney(person.id, organization.id));
    this.setState({ activity: results });
  };

  submit = async data => {
    const { person, organization, dispatch } = this.props;
    const { action, text } = data;
    let interaction = action;

    if (!interaction) {
      interaction = INTERACTION_TYPES.MHInteractionTypeNote;
    }

    await dispatch(
      addNewInteraction(person.id, interaction, text, organization.id),
    );
    // reload the feed after adding the interaction
    this.loadFeed();
  };

  handleAssign = async () => {
    const { dispatch, organization, me, person } = this.props;
    await dispatch(createContactAssignment(organization.id, me.id, person.id));
    // TODO: Navigate away after a person is assigned to me
    // dispatch(navigatePush(GROUP_PERSON_VIEW));
  };

  render() {
    const { t, organization, person, me } = this.props;
    const { activity } = this.state;
    const orgName = organization ? organization.name : undefined;
    return (
      <PlatformKeyboardAvoidingView style={styles.container}>
        <Header left={<BackButton />} title={orgName} shadow={false} />
        <GroupsContactList
          activity={activity}
          person={person}
          onAssign={this.handleAssign}
          myId={me.id}
        />
        <CommentBox placeholder={t('placeholder')} onSubmit={this.submit} />
      </PlatformKeyboardAvoidingView>
    );
  }
}

UnassignedPersonScreen.propTypes = {
  organization: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.person,
});

export default connect(mapStateToProps)(UnassignedPersonScreen);
export const UNASSIGNED_PERSON_SCREEN = 'nav/UNASSIGNED_PERSON';
