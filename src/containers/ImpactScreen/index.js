import React, { Component } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';

import { logout } from '../../actions/auth';
import { getGlobalImpact, getMyImpact } from '../../actions/impact';

import styles from './styles';
import { Flex, Text, IconButton } from '../../components/common';
import Header from '../Header';
import { intToStringLocale } from '../../utils/common';

const year = new Date().getFullYear();
const myImpactStr = ({ steps_count, receivers_count, pathway_moved_count }) =>
  `In ${year}, you took ${intToStringLocale(steps_count)} steps of faith with ${intToStringLocale(receivers_count)} people.

${intToStringLocale(pathway_moved_count)} people reached a new stage on their spiritual journey.`;
const globalImpactStr = ({ steps_count, receivers_count, pathway_moved_count }) =>
  `In ${year}, users took ${intToStringLocale(steps_count)} steps of faith with ${intToStringLocale(receivers_count)} people.

${intToStringLocale(pathway_moved_count)} people reached a new stage on their spiritual journey.`;

class ImpactScreen extends Component {
  
  componentWillMount() {
    this.props.dispatch(getGlobalImpact());
    this.props.dispatch(getMyImpact());
  }
  
  render() {
    const { globalImpact, myImpact } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => this.props.dispatch(logout())} />
          }
          title="IMPACT"
        />
        <ScrollView
          bounces={false}
        >
          <Flex style={styles.topSection}>
            <Text style={[styles.text, styles.topText]}>
              {myImpactStr(myImpact)}
            </Text>
          </Flex>
          <Image style={styles.image} source={require('../../../assets/images/impactBackground.png')} />
          <Flex style={styles.bottomSection}>
            <Text style={[styles.text, styles.bottomText]}>
              {globalImpactStr(globalImpact)}
            </Text>
          </Flex>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ impact }) => ({
  myImpact: impact.mine,
  globalImpact: impact.global,
});

export default connect(mapStateToProps)(ImpactScreen);
