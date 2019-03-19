/* eslint max-params: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import uuidv4 from 'uuid/v4';

import { STATUS_SELECT_SCREEN } from '../../containers/StatusSelectScreen';
import { navigatePush } from '../../actions/navigation';
import {
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
} from '../../routes/constants';
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
import {
  openCommunicationLink,
  navigateToStageScreen,
} from '../../actions/misc';

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

  getSelfStageButton() {
    const { myStageId } = this.props;

    return this.getStageButton(this.handleSelectStage, myStageId);
  }

  getPersonStageButton() {
    const { contactAssignment } = this.props;

    return this.getStageButton(
      this.handleSelectStage,
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
    return this.button('statusIcon', t('statusSelect:header'), () =>
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

  handleSelectStage = () => {
    const {
      dispatch,
      myId,
      person,
      contactAssignment = null,
      organization,
      myStageId,
      stages,
    } = this.props;

    const isMe = person.id === myId;
    const stageId = getStageIndex(
      stages,
      isMe
        ? myStageId
        : contactAssignment && contactAssignment.pathway_stage_id,
    );

    dispatch(
      navigateToStageScreen(
        isMe,
        person,
        contactAssignment,
        organization,
        stageId,
      ),
    );
  };

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
          <AssignStageButton person={person} organization={organization} />
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
  myStageId: PropTypes.number,
  stages: PropTypes.array.isRequired,
  isVisible: PropTypes.bool,
  isCruOrg: PropTypes.bool,
  contactAssignment: PropTypes.object,
};
