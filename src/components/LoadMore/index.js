import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Button } from '../common';

import styles from './styles';

@translate('loadMore')
class LoadMore extends Component {
  render() {
    const { onPress, t } = this.props;
    return (
      <Button
        type="transparent"
        onPress={onPress}
        style={styles.button}
        text={t('load').toUpperCase()}
        buttonTextStyle={styles.text}
      />
    );
  }
}

LoadMore.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default LoadMore;
