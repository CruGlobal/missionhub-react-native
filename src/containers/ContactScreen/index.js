import React, { Component } from 'react';
import { View } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigateToStageScreen } from '../../actions/misc';
import { Flex, IconButton } from '../../components/common';
import ContactHeader from '../../components/ContactHeader';
import Header from '../Header';
import { CASEY, CONTACT_MENU_DRAWER, JEAN } from '../../constants';
import { getPersonDetails } from '../../actions/person';
import {
  personSelector,
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../../selectors/people';
import { organizationSelector } from '../../selectors/organizations';
import { isMissionhubUser, getStageIndex } from '../../utils/common';
import { promptToAssign } from '../../utils/promptToAssign';
import BackButton from '../BackButton';

import styles from './styles';

@translate('contactScreen')
export class ContactScreen extends Component {
  state = {
    headerOpen: true,
  };

  componentDidMount() {
    const { person, organization = {} } = this.props;
    this.props.dispatch(getPersonDetails(person.id, organization.id));
  }

  handleChangeStage = async (noNav = false, onComplete = null) => {
    const {
      dispatch,
      personIsCurrentUser,
      person,
      contactAssignment,
      contactStage,
      stages,
      organization = {},
    } = this.props;
    if (await this.promptToAssign(personIsCurrentUser, contactAssignment)) {
      const firstItemIndex = getStageIndex(
        stages,
        contactStage && contactStage.id,
      );

      return dispatch(
        navigateToStageScreen(
          personIsCurrentUser,
          person,
          contactAssignment,
          organization,
          firstItemIndex,
          noNav,
          onComplete,
        ),
      );
    }
  };

  getTitle() {
    const { person, organization } = this.props;
    if (!this.state.headerOpen) {
      return (person.first_name || '').toUpperCase();
    } else if (organization) {
      return organization.name;
    }
    return undefined;
  }

  async promptToAssign(
    personIsCurrentUser = false,
    hasContactAssignment = false,
  ) {
    const shouldPromptToAssign = !personIsCurrentUser && !hasContactAssignment;
    return shouldPromptToAssign ? await promptToAssign() : true;
  }

  render() {
    const {
      dispatch,
      person,
      contactAssignment,
      organization,
      isJean,
      contactStage,
      personIsCurrentUser,
      isMissionhubUser,
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={<BackButton />}
          right={
            <IconButton
              name="moreIcon"
              type="MissionHub"
              onPress={() =>
                dispatch(
                  DrawerActions.openDrawer({
                    drawer: CONTACT_MENU_DRAWER,
                    isCurrentUser: personIsCurrentUser,
                  }),
                )
              }
            />
          }
          shadow={false}
          title={this.getTitle()}
        />
        <Flex
          align="center"
          justify="center"
          value={1}
          style={styles.container}
        >
          <ContactHeader
            onChangeStage={this.handleChangeStage}
            type={isJean ? JEAN : CASEY}
            isMe={personIsCurrentUser}
            person={person}
            contactAssignment={contactAssignment}
            organization={organization}
            isMissionhubUser={isMissionhubUser}
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

export const mapStateToProps = (
  { auth, stages, people, organizations },
  { navigation },
) => {
  const navParams = navigation.state.params;
  const orgId = navParams.organization && navParams.organization.id;
  const person =
    personSelector({ people }, { personId: navParams.person.id, orgId }) ||
    navParams.person;
  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person, orgId },
  );
  const organization = organizationSelector({ organizations }, { orgId });
  const orgPermission = orgPermissionSelector(null, {
    person,
    organization: navParams.organization,
  });

  return {
    ...(navigation.state.params || {}),
    person,
    isJean: auth.isJean,
    stages: stages.stages,
    myId: auth.person.id,
    organization,
    personIsCurrentUser: person.id === auth.person.id,
    contactAssignment: contactAssignment,
    contactStage:
      stages.stagesObj[
        (contactAssignment && contactAssignment.pathway_stage_id) ||
          (person.user && person.user.pathway_stage_id)
      ],
    orgPermission: orgPermission,
    isMissionhubUser: isMissionhubUser(orgPermission),
  };
};

export default connect(mapStateToProps)(ContactScreen);
export const CONTACT_SCREEN = 'nav/CONTACT';
