import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Button } from '../common';

import styles from './styles';

@withTranslation('loadMore')
class LoadMore extends Component {
  render() {
    const { onPress, t, text } = this.props;
    return (
      <Button
        type="transparent"
        onPress={onPress}
        style={styles.button}
        text={text || t('load').toUpperCase()}
        buttonTextStyle={styles.text}
      />
    );
  }
}

LoadMore.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default LoadMore;
