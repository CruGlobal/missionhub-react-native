import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Button } from '../common';

import styles from './styles';

@translate()
class AbsoluteSkip extends Component {
  render() {
    const { t, onSkip } = this.props;

    return (
      <Flex style={styles.skipWrap}>
        <Button
          type="transparent"
          onPress={onSkip}
          text={t('skip').toUpperCase()}
          style={styles.skipBtn}
          buttonTextStyle={styles.skipBtnText}
        />
      </Flex>
    );
  }
}

AbsoluteSkip.propTypes = {
  onSkip: PropTypes.func.isRequired,
};

export default AbsoluteSkip;
