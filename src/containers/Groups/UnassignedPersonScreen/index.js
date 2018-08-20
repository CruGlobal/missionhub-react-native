import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getGroupJourney } from '../../../actions/journey';
import GroupsContactList from '../../../components/GroupsContactList/index';
import CommentBox from '../../../components/CommentBox/index';
import Header from '../../Header/index';
import BackButton from '../../BackButton/index';

import styles from './styles';

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

  render() {
    const { organization, person, me } = this.props;
    const { activity } = this.state;

    return (
      <View style={styles.container}>
        <Header
          left={<BackButton />}
          title={organization.name}
          shadow={false}
        />
        <GroupsContactList
          activity={activity}
          person={person}
          organization={organization}
          myId={me.id}
        />
        <CommentBox
          onSubmit={this.loadFeed}
          person={person}
          organization={organization}
        />
      </View>
    );
  }
}

UnassignedPersonScreen.propTypes = {
  organization: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
};

const mapStateToProps = (
  { auth },
  {
    navigation: {
      state: {
        params: { person, organization },
      },
    },
  },
) => ({
  person,
  organization,
  me: auth.person,
});

export default connect(mapStateToProps)(UnassignedPersonScreen);
export const UNASSIGNED_PERSON_SCREEN = 'nav/UNASSIGNED_PERSON';
