import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Button } from '../common';

import styles from './styles';

@translate()
export default class AssignToMeButton extends Component {
  render() {
    const { onPress, t } = this.props;

    return (
      <Button
        type="transparent"
        onPress={onPress}
        text={t('assignToMe').toUpperCase()}
        style={styles.assignButton}
        buttonTextStyle={styles.assignButtonText}
      />
    );
  }
}

AssignToMeButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};
