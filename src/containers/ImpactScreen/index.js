import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { IconButton } from '../../components/common';
import Header from '../Header';
import ImpactView from '../ImpactView';
import { openMainMenu } from '../../utils/common';

@translate('impact')
class ImpactScreen extends Component {
  render() {
    const { t, dispatch, person } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton
              name="menuIcon"
              type="MissionHub"
              onPress={() => dispatch(openMainMenu())}
            />
          }
          title={t('header').toUpperCase()}
        />
        <ImpactView person={person} />
      </View>
    );
  }
}

export const mapStateToProps = ({ auth }) => {
  const person = auth.person;

  return { person };
};

export default connect(mapStateToProps)(ImpactScreen);
