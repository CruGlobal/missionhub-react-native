import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { navigatePush, navigateBack } from '../../actions/navigation';

import styles from './styles';
import { Flex, IconButton } from '../../components/common';
import ContactHeader from '../../components/ContactHeader';
import Header from '../Header';
import { CASEY, CONTACT_MENU_DRAWER, DRAWER_OPEN, JEAN } from '../../constants';
import { STAGE_SCREEN } from '../StageScreen';
import { PERSON_STAGE_SCREEN } from '../PersonStageScreen';
import { getPersonDetails, updatePersonAttributes } from '../../actions/person';
import { personSelector, contactAssignmentSelector } from '../../selectors/people';

export class ContactScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headerOpen: true,
    };

    this.handleChangeStage = this.handleChangeStage.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getPersonDetails(this.props.person.id));
  }

  handleChangeStage() {
    const { dispatch, personIsCurrentUser, person, contactAssignment, contactStage,stages } = this.props;
    let firstItemIndex = stages.findIndex((s) => contactStage && `${s.id}` === `${contactStage.id}`);
    firstItemIndex = firstItemIndex >= 0 ? firstItemIndex : undefined;
    if (personIsCurrentUser) {
      dispatch(navigatePush(STAGE_SCREEN, {
        onComplete: (stage) => dispatch(updatePersonAttributes(person.id, { user: { pathway_stage_id: stage.id } })),
        firstItem: firstItemIndex,
        contactId: person.id,
        section: 'people',
        subsection: 'self',
        enableBackButton: true,
      }));
    } else {
      dispatch(navigatePush(PERSON_STAGE_SCREEN, {
        onComplete: (stage) =>
          dispatch(updatePersonAttributes(person.id, {
            reverse_contact_assignments: person.reverse_contact_assignments.map((assignment) =>
              assignment.id === contactAssignment.id ? { ...assignment, pathway_stage_id: stage.id } : assignment
            ),
          })),
        firstItem: firstItemIndex,
        name: person.first_name,
        contactId: person.id,
        contactAssignmentId: contactAssignment && contactAssignment.id,
        section: 'people',
        subsection: 'person',
      }));
    }
  }

  getTitle() {
    const { person, organization } = this.props;
    if (!this.state.headerOpen) {
      return (person.first_name || '').toUpperCase();
    } else if (organization) {
      return organization.name;
    }
    return undefined;
  }

  render() {
    const { dispatch, person, organization, isJean, contactStage, personIsCurrentUser } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton
              name="backIcon"
              type="MissionHub"
              onPress={() => dispatch(navigateBack())}
            />
          }
          right={
            <IconButton
              name="moreIcon"
              type="MissionHub"
              onPress={() => dispatch(navigatePush(DRAWER_OPEN, { drawer: CONTACT_MENU_DRAWER, isCurrentUser: personIsCurrentUser }))}
            />
          }
          shadow={false}
          title={this.getTitle()}
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <ContactHeader
            onChangeStage={this.handleChangeStage}
            type={isJean ? JEAN : CASEY}
            isMe={personIsCurrentUser}
            person={person}
            organization={organization}
            stage={contactStage}
            dispatch={dispatch}
            onShrinkHeader={() => this.setState({ headerOpen: false })}
            onOpenHeader={() => this.setState({ headerOpen: true })}
          />
        </Flex>
      </View>
    );
  }
}

ContactScreen.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
  organization: PropTypes.object,
};


export const mapStateToProps = ({ auth, stages, people }, { navigation }) => {
  const navParams = navigation.state.params;
  const person = personSelector({ people }, { personId: navParams.person.id, orgId: navParams.organization && navParams.organization.id }) || navParams.person;
  const contactAssignment = contactAssignmentSelector({ auth }, { person });

  return {
    ...(navigation.state.params || {}),
    person,
    isJean: auth.isJean,
    stages: stages.stages,
    myId: auth.personId,
    personIsCurrentUser: person.id === auth.personId,
    contactAssignment: contactAssignment,
    contactStage: stages.stagesObj[(contactAssignment && contactAssignment.pathway_stage_id || person.user && person.user.pathway_stage_id)],
  };
};

export default connect(mapStateToProps)(ContactScreen);
export const CONTACT_SCREEN = 'nav/CONTACT';
