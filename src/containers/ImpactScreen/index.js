import React, { Component } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getGlobalImpact, getMyImpact } from '../../actions/impact';

import styles from './styles';
import { Flex, Text, IconButton } from '../../components/common';
import Header from '../Header';
import { intToStringLocale } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';

@translate('impact')
class ImpactScreen extends Component {

  componentWillMount() {
    this.props.dispatch(getGlobalImpact());
    this.props.dispatch(getMyImpact());
  }

  buildImpactSentence({ steps_count = 0, receivers_count = 0, pathway_moved_count = 0 }, global = false) {
    return this.props.t('impactSentence', {
      year: new Date().getFullYear(),
      initiator: global ? '$t(users)' : '$t(you)',
      stepsCount: intToStringLocale(steps_count),
      receiversCount: intToStringLocale(receivers_count),
      pathwayMovedCount: intToStringLocale(pathway_moved_count),
    });
  }

  render() {
    const { t, globalImpact, myImpact } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => this.props.dispatch(navigatePush('DrawerOpen'))} />
          }
          title={t('header').toUpperCase()}
        />
        <ScrollView
          bounces={false}
        >
          <Flex style={styles.topSection}>
            <Text style={[styles.text, styles.topText]}>
              {this.buildImpactSentence(myImpact)}
            </Text>
          </Flex>
          <Image style={styles.image} source={require('../../../assets/images/impactBackground.png')} />
          <Flex style={styles.bottomSection}>
            <Text style={[styles.text, styles.bottomText]}>
              {this.buildImpactSentence(globalImpact, true)}
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
