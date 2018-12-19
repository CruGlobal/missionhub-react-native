import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import uuidv4 from 'uuid/v4';

import { STATUS_SELECT_SCREEN } from '../../containers/StatusSelectScreen';
import { getPersonDetails, updatePersonAttributes } from '../../actions/person';
import { loadStepsAndJourney } from '../../actions/misc';
import { navigatePush } from '../../actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../containers/PersonStageScreen';
import { STAGE_SCREEN } from '../../containers/StageScreen';
import { ACTIONS } from '../../constants';
import {
  getPersonEmailAddress,
  getPersonPhoneNumber,
  getStageIndex,
} from '../../utils/common';
import AssignToMeButton from '../AssignToMeButton/index';
import AssignStageButton from '../AssignStageButton';
import CenteredIconButtonWithText from '../CenteredIconButtonWithText';
import { Flex } from '../common';
import { openCommunicationLink } from '../../actions/misc';

import styles from './styles';

@translate()
export default class GroupsPersonHeader extends Component {
  computeButtons() {
    const { person, myId, isMember, contactAssignment, isCruOrg } = this.props;
    const personStageButton = contactAssignment
      ? [this.getPersonStageButton()]
      : [];
    const statusButton =
      !isMember && contactAssignment && contactAssignment.organization
        ? [this.getStatusButton()]
        : [];
    const contactButtons =
      isCruOrg && (contactAssignment || isMember)
        ? this.getContactOptionButtons()
        : [];

    return person.id === myId
      ? this.getMeButton()
      : [...personStageButton, ...statusButton, ...contactButtons];
  }

  selectSelfStage = () => {
    const { dispatch, person, organization, myStageId, stages } = this.props;

    dispatch(
      navigatePush(STAGE_SCREEN, {
        onComplete: stage => {
          dispatch(
            updatePersonAttributes(person.id, {
              user: { pathway_stage_id: stage.id },
            }),
          );
          dispatch(loadStepsAndJourney(person, organization));
        },
        firstItem: getStageIndex(stages, myStageId),
        contactId: person.id,
        section: 'people',
        subsection: 'self',
        enableBackButton: true,
      }),
    );
  };

  selectPersonStage = () => {
    const {
      contactAssignment,
      dispatch,
      person,
      organization,
      stages,
    } = this.props;

    const firstItemIndex =
      contactAssignment &&
      getStageIndex(stages, contactAssignment.pathway_stage_id);

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
          dispatch(loadStepsAndJourney(person, organization));
        },
        firstItem: firstItemIndex,
        name: person.first_name,
        contactId: person.id,
        contactAssignmentId: contactAssignment && contactAssignment.id,
        orgId: organization.id,
        section: 'people',
        subsection: 'person',
      }),
    );
  };

  getSelfStageButton() {
    const { myStageId } = this.props;

    return this.getStageButton(this.selectSelfStage, myStageId);
  }

  getPersonStageButton() {
    const { contactAssignment } = this.props;

    return this.getStageButton(
      this.selectPersonStage,
      contactAssignment.pathway_stage_id,
    );
  }

  getStageButton(onClick, stageId) {
    const { t } = this.props;

    let buttonStyle;
    let flexStyle;
    if (!stageId) {
      buttonStyle = styles.pathwayStageNotSet;
      flexStyle = styles.iconPathwayStageNotSet;
    }

    return this.button(
      'journeyIcon',
      t('profileLabels.stage'),
      onClick,
      buttonStyle,
      flexStyle,
    );
  }

  getMessageButton() {
    const { person, dispatch, t } = this.props;
    let onClick;

    const phoneNumber = getPersonPhoneNumber(person);

    if (phoneNumber) {
      onClick = () =>
        dispatch(
          openCommunicationLink(
            `sms:${phoneNumber.number}`,
            ACTIONS.TEXT_ENGAGED,
          ),
        );
    }

    return this.button('textIcon', t('profileLabels.message'), onClick);
  }

  getCallButton() {
    const { person, dispatch, t } = this.props;
    let onClick;

    const phoneNumber = getPersonPhoneNumber(person);

    if (phoneNumber) {
      onClick = () =>
        dispatch(
          openCommunicationLink(
            `tel:${phoneNumber.number}`,
            ACTIONS.CALL_ENGAGED,
          ),
        );
    }

    return this.button('callIcon', t('profileLabels.call'), onClick);
  }

  getEmailButton() {
    const { person, dispatch, t } = this.props;
    let onClick;

    const emailAddress = getPersonEmailAddress(person);

    if (emailAddress) {
      onClick = () =>
        dispatch(
          openCommunicationLink(
            `mailto:${emailAddress.email}`,
            ACTIONS.EMAIL_ENGAGED,
          ),
        );
    }

    return this.button(
      'emailIcon',
      t('profileLabels.email'),
      onClick,
      styles.emailButton,
    );
  }

  getStatusButton() {
    const { dispatch, person, organization, t } = this.props;
    return this.button('journeyWarning', t('statusSelect:header'), () =>
      dispatch(navigatePush(STATUS_SELECT_SCREEN, { person, organization })),
    );
  }

  getContactOptionButtons() {
    return [
      this.getMessageButton(),
      this.getCallButton(),
      this.getEmailButton(),
    ];
  }

  getMeButton() {
    return this.getSelfStageButton();
  }

  button(icon, text, onClick, buttonStyle, flexStyle) {
    return (
      <CenteredIconButtonWithText
        key={uuidv4()}
        icon={icon}
        text={text}
        onClick={onClick}
        buttonStyle={buttonStyle}
        wrapperStyle={flexStyle}
      />
    );
  }

  render() {
    const buttons = this.computeButtons();
    const {
      contactAssignment,
      myId,
      person,
      organization,
      isVisible,
      isCruOrg,
    } = this.props;
    if (isVisible === false) {
      return null;
    }

    return isCruOrg ? (
      <Flex>
        {contactAssignment || myId === person.id ? null : (
          <AssignToMeButton person={person} organization={organization} />
        )}
        <Flex align="center" justify="center" direction="row">
          {buttons}
        </Flex>
      </Flex>
    ) : (
      <Flex>
        {contactAssignment || myId === person.id ? (
          <AssignStageButton
            person={person}
            organization={organization}
            selectMyStage={this.selectSelfStage}
            selectPersonStage={this.selectPersonStage}
          />
        ) : null}
      </Flex>
    );
  }
}

GroupsPersonHeader.propTypes = {
  isMember: PropTypes.bool.isRequired,
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  myId: PropTypes.string.isRequired,
  stages: PropTypes.array.isRequired,
  isVisible: PropTypes.bool,
  isCruOrg: PropTypes.bool,
  contactAssignment: PropTypes.object,
};
