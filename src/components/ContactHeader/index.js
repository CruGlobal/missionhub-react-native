import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import i18next from '../../i18n';
import { Flex, Text, IconButton } from '../common';
import PillButton from '../PillButton';
import SecondaryTabBar from '../SecondaryTabBar';
import { ACTIONS, CASEY, JEAN } from '../../constants';
import {
  buildTrackingObj,
  openCommunicationLink,
  getPersonEmailAddress,
  getPersonPhoneNumber,
} from '../../utils/common';

import styles from './styles';

export const PERSON_STEPS = buildTrackingObj(
  'people : person : steps',
  'people',
  'person',
  'steps',
);
export const SELF_STEPS = buildTrackingObj(
  'people : self : steps',
  'people',
  'self',
  'steps',
);
const CASEY_TABS = [
  {
    page: 'steps',
    iconName: 'stepsIcon',
    tabLabel: i18next.t('contactHeader:mySteps'),
    tracking: PERSON_STEPS,
  },
  {
    page: 'journey',
    iconName: 'journeyIcon',
    tabLabel: i18next.t('contactHeader:ourJourney'),
    tracking: buildTrackingObj(
      'people : person : journey',
      'people',
      'person',
      'journey',
    ),
  },
  {
    page: 'notes',
    iconName: 'notesIcon',
    tabLabel: i18next.t('contactHeader:myNotes'),
    tracking: buildTrackingObj(
      'people : person : notes',
      'people',
      'person',
      'notes',
    ),
  },
];

const ME_TABS = [
  {
    page: 'steps',
    iconName: 'stepsIcon',
    tabLabel: i18next.t('contactHeader:mySteps'),
    tracking: SELF_STEPS,
  },
  {
    page: 'journey',
    iconName: 'journeyIcon',
    tabLabel: i18next.t('contactHeader:myJourney'),
    tracking: buildTrackingObj(
      'people : self : journey',
      'people',
      'self',
      'journey',
    ),
  },
  {
    page: 'userImpact',
    iconName: 'impactIcon',
    tabLabel: i18next.t('contactHeader:impact'),
    tracking: buildTrackingObj(
      'people : person : impact',
      'people',
      'person',
      'impact',
    ),
  },
];

const JEAN_TABS = [
  CASEY_TABS[0],
  {
    page: 'actions',
    iconName: 'actionsIcon',
    tabLabel: i18next.t('contactHeader:myActions'),
    tracking: buildTrackingObj(
      'people : person : actions',
      'people',
      'person',
      'actions',
    ),
  },
  CASEY_TABS[1],
  CASEY_TABS[2],
];

const JEAN_TABS_MH_USER = [
  ...JEAN_TABS,
  {
    page: 'userImpact',
    iconName: 'impactIcon',
    tabLabel: i18next.t('contactHeader:impact'),
    tracking: buildTrackingObj(
      'people : person : impact',
      'people',
      'person',
      'impact',
    ),
  },
];

class ContactHeader extends Component {
  state = {
    headerOpen: true,
  };

  shrinkHeader = () => {
    this.props.onShrinkHeader();
    this.setState({ headerOpen: false });
  };

  openHeader = () => {
    this.props.onOpenHeader();
    this.setState({ headerOpen: true });
  };

  getTabs = () => {
    const { type, isMe, organization, isMissionhubUser } = this.props;

    if (isMe) {
      return ME_TABS;
    } else if (
      type === CASEY ||
      !organization ||
      (organization && organization.id === 'personal')
    ) {
      return CASEY_TABS;
    } else if (isMissionhubUser) {
      return JEAN_TABS_MH_USER;
    }

    return JEAN_TABS;
  };

  onChangeStage = () => {
    this.props.onChangeStage();
  };

  getJeanButtons = () => {
    const { person, dispatch } = this.props;
    const emailAddress = getPersonEmailAddress(person);
    const phoneNumber = getPersonPhoneNumber(person);
    let phoneNumberUrl;
    let smsNumberUrl;
    let emailUrl;
    if (phoneNumber) {
      phoneNumberUrl = `tel:${phoneNumber.number}`;
      smsNumberUrl = `sms:${phoneNumber.number}`;
    }
    if (emailAddress) {
      emailUrl = `mailto:${emailAddress.email}`;
    }

    return (
      <Flex align="center" justify="center" direction="row">
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton
            disabled={!phoneNumber}
            style={
              phoneNumber ? styles.contactButton : styles.contactButtonDisabled
            }
            name="textIcon"
            type="MissionHub"
            onPress={() =>
              openCommunicationLink(
                smsNumberUrl,
                dispatch,
                ACTIONS.TEXT_ENGAGED,
              )
            }
          />
        </Flex>
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton
            disabled={!phoneNumber}
            style={
              phoneNumber ? styles.contactButton : styles.contactButtonDisabled
            }
            name="callIcon"
            type="MissionHub"
            onPress={() =>
              openCommunicationLink(
                phoneNumberUrl,
                dispatch,
                ACTIONS.CALL_ENGAGED,
              )
            }
          />
        </Flex>
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton
            disabled={!emailAddress}
            style={[
              emailAddress
                ? styles.contactButton
                : styles.contactButtonDisabled,
              styles.emailButton,
            ]}
            name="emailIcon"
            type="MissionHub"
            onPress={() =>
              openCommunicationLink(emailUrl, dispatch, ACTIONS.EMAIL_ENGAGED)
            }
          />
        </Flex>
      </Flex>
    );
  };

  render() {
    const {
      person,
      contactAssignment,
      organization,
      type,
      stage,
      isMe,
      onChangeStage,
    } = this.props;
    const hasStage = stage && stage.name;
    const isHeaderOpen = this.state.headerOpen;

    return (
      <Flex
        value={1}
        style={styles.wrap}
        direction="column"
        align="center"
        justify="center"
        self="stretch"
      >
        {isHeaderOpen ? (
          <Text style={styles.name}>
            {(person.first_name || '').toUpperCase()}
          </Text>
        ) : null}
        {isHeaderOpen ? (
          <PillButton
            filled={true}
            text={
              hasStage
                ? stage.name.toUpperCase()
                : i18next.t('contactHeader:selectStage')
            }
            style={hasStage ? styles.stageBtn : styles.noStage}
            buttonTextStyle={styles.stageBtnText}
            onPress={this.onChangeStage}
          />
        ) : null}
        {isHeaderOpen && type === JEAN ? this.getJeanButtons() : null}
        <SecondaryTabBar
          isMe={isMe}
          person={person}
          organization={organization}
          contactStage={stage}
          onChangeStage={onChangeStage}
          contactAssignment={contactAssignment}
          tabs={this.getTabs()}
          onShrinkHeader={this.shrinkHeader}
          onOpenHeader={this.openHeader}
        />
      </Flex>
    );
  }
}

ContactHeader.propTypes = {
  person: PropTypes.object.isRequired,
  contactAssignment: PropTypes.object,
  organization: PropTypes.object,
  isMissionhubUser: PropTypes.bool,
  type: PropTypes.string.isRequired,
  stage: PropTypes.object,
  onChangeStage: PropTypes.func.isRequired,
  isMe: PropTypes.bool.isRequired,
};

export default connect()(ContactHeader);
