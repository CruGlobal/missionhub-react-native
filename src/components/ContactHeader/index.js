import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text } from '../common';
import styles from './styles';
import PillButton from '../PillButton';
import SecondaryTabBar from '../SecondaryTabBar';

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

export default class ContactHeader extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    const { name } = this.props;

    return (
      <Flex value={1} style={styles.wrap} direction="column" align="center" justify="center">
        <Text style={styles.name}>{name.toUpperCase()}</Text>
        <PillButton
          filled={true}
          text="STAGE"
          style={styles.stageBtn}
          buttonTextStyle={styles.stageBtnText}
          onPress={()=>{}}
        />
        <SecondaryTabBar tabs={CASEY_TABS} />
      </Flex>
    );
  }
}

ContactHeader.propTypes = {
  name: PropTypes.string.isRequired,
};
