import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Button } from '../common';

import styles from './styles';

@withTranslation()
class AbsoluteSkip extends Component {
  render() {
    const { t, onSkip, style, textStyle } = this.props;

    return (
      <SafeAreaView style={styles.skipWrap}>
        <Button
          type="transparent"
          onPress={onSkip}
          text={t('skip').toUpperCase()}
          style={[styles.skipBtn, style]}
          buttonTextStyle={[styles.skipBtnText, textStyle]}
        />
      </SafeAreaView>
    );
  }
}

AbsoluteSkip.propTypes = {
  onSkip: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default AbsoluteSkip;
