/* eslint max-params: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import uuidv4 from 'uuid/v4';

import { STATUS_SELECT_SCREEN } from '../../containers/StatusSelectScreen';
import { navigatePush } from '../../actions/navigation';
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

// @ts-ignore
@withTranslation()
export default class GroupsPersonHeader extends Component {
  computeButtons() {
    // @ts-ignore
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
    // @ts-ignore
    const { myStageId } = this.props;

    return this.getStageButton(this.handleSelectStage, myStageId);
  }

  getPersonStageButton() {
    // @ts-ignore
    const { contactAssignment } = this.props;

    return this.getStageButton(
      this.handleSelectStage,
      contactAssignment.pathway_stage_id,
    );
  }

  // @ts-ignore
  getStageButton(onClick, stageId) {
    // @ts-ignore
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
    // @ts-ignore
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

    // @ts-ignore
    return this.button('textIcon', t('profileLabels.message'), onClick);
  }

  getCallButton() {
    // @ts-ignore
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

    // @ts-ignore
    return this.button('callIcon', t('profileLabels.call'), onClick);
  }

  getEmailButton() {
    // @ts-ignore
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

    // @ts-ignore
    return this.button(
      'emailIcon',
      t('profileLabels.email'),
      onClick,
      styles.emailButton,
    );
  }

  getStatusButton() {
    // @ts-ignore
    const { dispatch, person, organization, t } = this.props;
    // @ts-ignore
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

  // @ts-ignore
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
      // @ts-ignore
      dispatch,
      // @ts-ignore
      myId,
      // @ts-ignore
      person,
      // @ts-ignore
      contactAssignment = null,
      // @ts-ignore
      organization,
      // @ts-ignore
      myStageId,
      // @ts-ignore
      stages,
    } = this.props;

    const isMe = person.id === myId;
    const stageId = getStageIndex(
      stages,
      isMe
        ? myStageId
        : contactAssignment && contactAssignment.pathway_stage_id,
    );

    dispatch(navigateToStageScreen(isMe, person, organization, stageId));
  };

  render() {
    const buttons = this.computeButtons();
    const {
      // @ts-ignore
      contactAssignment,
      // @ts-ignore
      myId,
      // @ts-ignore
      person,
      // @ts-ignore
      organization,
      // @ts-ignore
      isVisible,
      // @ts-ignore
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

// @ts-ignore
GroupsPersonHeader.propTypes = {
  isMember: PropTypes.bool.isRequired,
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  myId: PropTypes.string.isRequired,
  myStageId: PropTypes.string,
  stages: PropTypes.array.isRequired,
  isVisible: PropTypes.bool,
  isCruOrg: PropTypes.bool,
  contactAssignment: PropTypes.object,
};
