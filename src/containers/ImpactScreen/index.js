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
import { openMainMenu } from '../../utils/common';

@translate('impact')
class ImpactScreen extends Component {

  componentWillMount() {
    this.props.dispatch(getGlobalImpact());
    this.props.dispatch(getMyImpact());
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
