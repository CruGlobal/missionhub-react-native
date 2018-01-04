import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, IconButton } from '../common';
import styles from './styles';
import PillButton from '../PillButton';
import SecondaryTabBar from '../SecondaryTabBar';
import { CASEY, JEAN } from '../../constants';

const CASEY_TABS = [
  {
    page: 'steps',
    iconName: 'stepsIcon',
    tabLabel: 'My Steps',
  },
  {
    page: 'journey',
    iconName: 'journeyIcon',
    tabLabel: 'Our Journey',
  },
  {
    page: 'notes',
    iconName: 'notesIcon',
    tabLabel: 'My Notes',
  },
];

const JEAN_TABS = [
  CASEY_TABS[0],
  {
    page: 'actions',
    iconName: 'actionsIcon',
    tabLabel: 'My Actions',
  },
  CASEY_TABS[1],
  CASEY_TABS[2],
];

const JEAN_TABS_MH_USER = [
  ...JEAN_TABS,
  {
    page: 'userImpact',
    iconName: 'impactIcon',
    tabLabel: 'Impact',
  },
];

export default class ContactHeader extends Component {

  constructor(props) {
    super(props);
  }

  getTabs() {
    const { person, type } = this.props;

    if (type === CASEY) {
      return CASEY_TABS;
    } else if (person.userId) {
      return JEAN_TABS_MH_USER;
    }

    return JEAN_TABS;
  }

  getJeanButtons() {
    return (
      <Flex align="center" justify="center" direction="row">
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton style={styles.contactButton} name="textIcon" type="MissionHub" onPress={()=> LOG('text')} />
        </Flex>
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton style={styles.contactButton} name="callIcon" type="MissionHub" onPress={()=> LOG('call')} />
        </Flex>
        {
          this.props.person.userId ? (
            <Flex align="center" justify="center" style={styles.iconWrap}>
              <IconButton style={styles.contactButton} name="emailIcon" type="MissionHub" onPress={()=> LOG('email')} />
            </Flex>
          ) : null
        }
      </Flex>
    );
  }

  render() {
    const { person, type, stage } = this.props;
    return (
      <Flex value={1} style={styles.wrap} direction="column" align="center" justify="center">
        <Text style={styles.name}>{person.first_name.toUpperCase()}</Text>
        <PillButton
          filled={true}
          text={stage && stage.name ? stage.name.toUpperCase() : 'SELECT STAGE'}
          style={styles.stageBtn}
          buttonTextStyle={styles.stageBtnText}
          onPress={this.props.onChangeStage}
        />
        { type === JEAN ? this.getJeanButtons() : null }
        <SecondaryTabBar person={person} tabs={this.getTabs()} />
      </Flex>
    );
  }
}

ContactHeader.propTypes = {
  person: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  stage: PropTypes.object,
  onChangeStage: PropTypes.func.isRequired,
};
