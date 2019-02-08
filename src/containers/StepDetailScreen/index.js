import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Header from '../Header';
import BackButton from '../BackButton';
import { Flex, Button } from '../../components/common';

import styles from './styles';

@translate()
export class StepDetailScreen extends Component {
  render() {
    const { t } = this.props;
    return (
      <Flex value={1} style={styles.container}>
        <Header
          left={<BackButton />}
          right={
            <Button
              type="transparent"
              text={t('removeStep').toUpperCase()}
              onPress={() => {}}
              style={styles.removeStepButton}
              buttonTextStyle={styles.removeStepButtonText}
            />
          }
          shadow={false}
          style={styles.header}
        />
      </Flex>
    );
  }
}

export default connect()(StepDetailScreen);

export const STEP_DETAIL_SCREEN = 'nav/STEP_DETAIL';
