import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';

import { getGroupJourney } from '../../../actions/journey';
import JourneyCommentBox from '../../../components/JourneyCommentBox';
import GroupsContactList from '../../../components/GroupsContactList';
import Header from '../../../components/Header';
import DeprecatedBackButton from '../../DeprecatedBackButton';
import { organizationSelector } from '../../../selectors/organizations';
import { personSelector } from '../../../selectors/people';
import { getPersonDetails } from '../../../actions/person';

import styles from './styles';

class UnassignedPersonScreen extends Component {
  state = { activity: [] };

  componentDidMount() {
    this.loadFeed();
  }

  loadFeed = async () => {
    // @ts-ignore
    const { dispatch, person } = this.props;
    dispatch(getPersonDetails(person.id, undefined));
    const results = await dispatch(getGroupJourney(person.id, undefined));
    this.setState({ activity: results });
  };

  render() {
    // @ts-ignore
    const { person, me, onAssign } = this.props;
    const { activity } = this.state;

    return (
      <View style={styles.pageContainer}>
        <Header left={<DeprecatedBackButton />} />
        <GroupsContactList
          activity={activity}
          person={person}
          myId={me.id}
          onAssign={onAssign}
        />
        <JourneyCommentBox
          onSubmit={this.loadFeed}
          person={person}
          organization={null}
        />
      </View>
    );
  }
}

// @ts-ignore
UnassignedPersonScreen.propTypes = {
  organization: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
  onAssign: PropTypes.func,
};

// @ts-ignore
const mapStateToProps = ({ auth, people, organizations }, { navigation }) => {
  const navParams = navigation.state.params || {};
  const { person: navPerson = {}, organization: navOrg = {} } = navParams;
  const orgId = navOrg.id || 'personal';
  const personId = navPerson.id;

  const organization =
    organizationSelector({ organizations }, { orgId }) || navOrg;
  const person = personSelector({ people }, { personId }) || navPerson;

  return {
    ...navParams,
    person,
    organization,
    me: auth.person,
  };
};

export default connect(mapStateToProps)(UnassignedPersonScreen);
export const UNASSIGNED_PERSON_SCREEN = 'nav/UNASSIGNED_PERSON';
