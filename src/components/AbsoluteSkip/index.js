import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Button } from '../common';

import styles from './styles';

@translate()
class AbsoluteSkip extends Component {
  render() {
    const { t, onSkip } = this.props;

    return (
      <SafeAreaView style={styles.skipWrap}>
        <Button
          type="transparent"
          onPress={onSkip}
          text={t('skip').toUpperCase()}
          style={styles.skipBtn}
          buttonTextStyle={styles.skipBtnText}
        />
      </SafeAreaView>
    );
  }
}

AbsoluteSkip.propTypes = {
  onSkip: PropTypes.func.isRequired,
};

export default AbsoluteSkip;
