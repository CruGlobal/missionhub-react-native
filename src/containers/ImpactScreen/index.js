import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getGlobalImpact, getMyImpact } from '../../actions/impact';

// import styles from './styles';
import { IconButton } from '../../components/common';
import Header from '../Header';
import ImpactView from '../ImpactView';
import { intToStringLocale, openMainMenu } from '../../utils/common';

@translate('impact')
class ImpactScreen extends Component {

  componentWillMount() {
    this.props.dispatch(getGlobalImpact());
    this.props.dispatch(getMyImpact());
  }

  buildImpactSentence({ steps_count = 0, receivers_count = 0, step_owners_count = 0, pathway_moved_count = 0 }, global = false) {
    return this.props.t('impactSentence', {
      year: new Date().getFullYear(),
      numInitiators: global ? intToStringLocale(step_owners_count) : '',
      initiator: global ? '$t(users)' : '$t(you)',
      stepsCount: intToStringLocale(steps_count),
      receiversCount: intToStringLocale(receivers_count),
      pathwayMovedCount: intToStringLocale(pathway_moved_count),
    });
  }

  render() {
    const { t } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => this.props.dispatch(openMainMenu())} />
          }
          title={t('header').toUpperCase()}
        />
        <ImpactView />
      </View>
    );
  }
}

ImpactScreen.propTypes = {
  isContactScreen: PropTypes.bool,
};

const mapStateToProps = ({ impact }) => ({
  myImpact: impact.mine,
  globalImpact: impact.global,
});

export default connect(mapStateToProps)(ImpactScreen);
