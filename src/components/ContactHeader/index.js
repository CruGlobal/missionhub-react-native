import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text } from '../common';
import styles from './styles';
import PillButton from '../PillButton';
import SecondaryTabBar from '../SecondaryTabBar';

const TABS = [
  {
    page: 'test',
    iconName: 'stepsIcon',
    tabLabel: 'My Steps',
  },
  {
    page: 'test2',
    iconName: 'journeyIcon',
    tabLabel: 'Our Journey',
  },
  {
    page: 'test3',
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
        <SecondaryTabBar tabs={TABS} />
      </Flex>
    );
  }
}

ContactHeader.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
