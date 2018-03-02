import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import i18next from '../../i18n';

import { Flex, Text, IconButton } from '../common';
import styles from './styles';
import PillButton from '../PillButton';
import SecondaryTabBar from '../SecondaryTabBar';
import { ACTIONS, CASEY, JEAN } from '../../constants';
import { buildTrackingObj } from '../../utils/common';
import { ORG_PERMISSIONS } from '../../constants';
import { trackAction } from '../../actions/analytics';
import { connect } from 'react-redux';

export const PERSON_STEPS = buildTrackingObj('people : person : steps', 'people', 'person', 'steps');
export const SELF_STEPS = buildTrackingObj('people : self : steps', 'people', 'self', 'steps');
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
    tracking: buildTrackingObj('people : person : journey', 'people', 'person', 'journey'),
  },
  {
    page: 'notes',
    iconName: 'notesIcon',
    tabLabel: i18next.t('contactHeader:myNotes'),
    tracking: buildTrackingObj('people : person : notes', 'people', 'person', 'notes'),
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
    tracking: buildTrackingObj('people : self : journey', 'people', 'self', 'journey'),
  },
];

const JEAN_TABS = [
  CASEY_TABS[0],
  {
    page: 'actions',
    iconName: 'actionsIcon',
    tabLabel: i18next.t('contactHeader:myActions'),
    tracking: buildTrackingObj('people : person : actions', 'people', 'person', 'actions'),
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
    tracking: buildTrackingObj('people : person : impact', 'people', 'person', 'impact'),
  },
];

class ContactHeader extends Component {

  state = {
    headerOpen: true,
  };

  shrinkHeader = () => {
    this.props.onShrinkHeader();
    this.setState({ headerOpen: false });
  }

  openHeader = () => {
    this.props.onOpenHeader();
    this.setState({ headerOpen: true });
  }

  getTabs() {
    const { person, type, isMe, organization } = this.props;
    const personOrgPermissions = organization && person.organizational_permissions.find((o) => o.organization_id === organization.id);
    const isMhubUser = personOrgPermissions && ORG_PERMISSIONS.includes(personOrgPermissions.permission_id);

    if (isMe) {
      return ME_TABS;
    } else if (type === CASEY || !organization || (organization && organization.id === 'personal')) {
      return CASEY_TABS;
    } else if (isMhubUser) {
      return JEAN_TABS_MH_USER;
    }

    return JEAN_TABS;
  }

  openUrl(url, action) {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        WARN('Can\'t handle url: ', url);
      } else {
        Linking.openURL(url)
          .then(() => {
            this.props.dispatch(trackAction(action));
          })
          .catch((err) => {
            if (url.includes('telprompt')) {
              // telprompt was cancelled and Linking openURL method sees this as an error
              // it is not a true error so ignore it to prevent apps crashing
            } else {
              WARN('openURL error', err);
            }
          });
      }
    }).catch((err) => WARN('An unexpected error happened', err));
  }

  getJeanButtons() {
    const { person } = this.props;
    const emailExists = person.email_addresses ? (person.email_addresses.find((email) => email.primary) || person.email_addresses[0] || null) : false;
    const numberExists = person.phone_numbers ? (person.phone_numbers.find((email) => email.primary) || person.phone_numbers[0] || null) : false;
    let phoneNumberUrl;
    let smsNumberUrl;
    let emailUrl;
    if (numberExists) {
      phoneNumberUrl = `tel:${numberExists.number}`;
      smsNumberUrl =`sms:${numberExists.number}`;
    }
    if (emailExists) {
      emailUrl = `mailto:${emailExists.email}`;
    }

    return (
      <Flex align="center" justify="center" direction="row">
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton disabled={!numberExists}
            style={numberExists ? styles.contactButton : styles.contactButtonDisabled}
            name="textIcon" type="MissionHub"
            onPress={()=> this.openUrl(smsNumberUrl, ACTIONS.TEXT_ENGAGED)} />
        </Flex>
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton disabled={!numberExists}
            style={numberExists ? styles.contactButton : styles.contactButtonDisabled}
            name="callIcon" type="MissionHub"
            onPress={() => this.openUrl(phoneNumberUrl, ACTIONS.CALL_ENGAGED)} />
        </Flex>
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton disabled={!emailExists} style={[ emailExists ? styles.contactButton : styles.contactButtonDisabled, styles.emailButton ]}
            name="emailIcon" type="MissionHub"
            onPress={() => this.openUrl(emailUrl, ACTIONS.EMAIL_ENGAGED)} />
        </Flex>
      </Flex>
    );
  }

  render() {
    const { person, contactAssignment, organization, type, stage, isMe, onChangeStage } = this.props;
    const hasStage = stage && stage.name;
    const isHeaderOpen = this.state.headerOpen;

    return (
      <Flex value={1} style={styles.wrap} direction="column" align="center" justify="center" self="stretch">
        {
          isHeaderOpen ? (
            <Text style={styles.name}>{(person.first_name || '').toUpperCase()}</Text>
          ) : null
        }
        {
          isHeaderOpen ? (
            <PillButton
              filled={true}
              text={hasStage ? stage.name.toUpperCase() : i18next.t('contactHeader:selectStage')}
              style={hasStage ? styles.stageBtn : styles.noStage}
              buttonTextStyle={styles.stageBtnText}
              onPress={this.props.onChangeStage}
            />
          ) : null
        }
        {
          isHeaderOpen && type === JEAN ? this.getJeanButtons() : null
        }
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
  type: PropTypes.string.isRequired,
  stage: PropTypes.object,
  onChangeStage: PropTypes.func.isRequired,
  isMe: PropTypes.bool.isRequired,
};

export default connect()(ContactHeader);
