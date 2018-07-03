import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../actions/navigation';
import { Flex, IconButton } from '../../components/common';
import ContactHeader from '../../components/ContactHeader';
import Header from '../Header';
import { CASEY, CONTACT_MENU_DRAWER, JEAN } from '../../constants';
import { STAGE_SCREEN } from '../StageScreen';
import { PERSON_STAGE_SCREEN } from '../PersonStageScreen';
import { getPersonDetails, updatePersonAttributes } from '../../actions/person';
import {
  personSelector,
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../../selectors/people';
import { reloadJourney } from '../../actions/journey';
import { organizationSelector } from '../../selectors/organizations';
import { isMissionhubUser } from '../../utils/common';
import BackButton from '../BackButton';
import { getContactSteps } from '../../actions/steps';

import styles from './styles';

@translate('contactScreen')
export class ContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headerOpen: true,
    };

    this.handleChangeStage = this.handleChangeStage.bind(this);
  }

  componentDidMount() {
    const { person, organization = {} } = this.props;
    this.props.dispatch(getPersonDetails(person.id, organization.id));
  }

  async handleChangeStage(noNav = false, onComplete = null) {
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
      let firstItemIndex = stages.findIndex(
        s => contactStage && s && `${s.id}` === `${contactStage.id}`,
      );
      firstItemIndex = firstItemIndex >= 0 ? firstItemIndex : undefined;
      if (personIsCurrentUser) {
        dispatch(
          navigatePush(STAGE_SCREEN, {
            onComplete: stage => {
              dispatch(
                updatePersonAttributes(person.id, {
                  user: { pathway_stage_id: stage.id },
                }),
              );
              dispatch(getContactSteps(person.id, organization.id));
              dispatch(reloadJourney(person.id, organization.id));
              onComplete && onComplete(stage);
            },
            firstItem: firstItemIndex,
            contactId: person.id,
            section: 'people',
            subsection: 'self',
            enableBackButton: true,
            noNav,
          }),
        );
      } else {
        dispatch(
          navigatePush(PERSON_STAGE_SCREEN, {
            onComplete: stage => {
              contactAssignment
                ? dispatch(
                    updatePersonAttributes(person.id, {
                      reverse_contact_assignments: person.reverse_contact_assignments.map(
                        assignment =>
                          assignment.id === contactAssignment.id
                            ? { ...assignment, pathway_stage_id: stage.id }
                            : assignment,
                      ),
                    }),
                  )
                : dispatch(getPersonDetails(person.id, organization.id));
              dispatch(getContactSteps(person.id, organization.id));
              dispatch(reloadJourney(person.id, organization.id));
              onComplete && onComplete(stage);
            },
            firstItem: firstItemIndex,
            name: person.first_name,
            contactId: person.id,
            contactAssignmentId: contactAssignment && contactAssignment.id,
            orgId: organization.id,
            section: 'people',
            subsection: 'person',
            noNav,
          }),
        );
      }
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

  async promptToAssign(
    personIsCurrentUser = false,
    hasContactAssignment = false,
  ) {
    const { t } = this.props;
    const shouldPromptToAssign = !personIsCurrentUser && !hasContactAssignment;
    return shouldPromptToAssign
      ? await new Promise(resolve =>
          Alert.alert(
            t('assignAlert:question'),
            t('assignAlert:sentence'),
            [
              {
                text: t('cancel'),
                style: 'cancel',
                onPress: () => resolve(false),
              },
              {
                text: t('continue'),
                style: 'default',
                onPress: () => {
                  resolve(true);
                },
              },
            ],
            { onDismiss: () => resolve(false) },
          ),
        )
      : true;
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
