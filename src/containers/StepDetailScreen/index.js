import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Header from '../Header';
import BackButton from '../BackButton';
import { Flex, Button, Text } from '../../components/common';

import styles from './styles';

@translate('stepDetail')
export class StepDetailScreen extends Component {
  render() {
    const { t } = this.props;
    return (
      <Flex value={1} style={styles.container}>
        <Header
          left={
            <BackButton
              iconStyle={styles.backButton}
              customIcon={'leftArrowIcon'}
            />
          }
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
        <Text>Share your faith with Sam</Text>
        <Text>Not quite sure how to do this?</Text>
        <Text>
          Find Common Ground. Ask people their story. What are their
          challenges?\nThat's an easy path to gain someone'e trust,
          understanding their problems, their stories, and it just builds from
          there.
        </Text>
      </Flex>
    );
  }
}

export default connect()(StepDetailScreen);

export const STEP_DETAIL_SCREEN = 'nav/STEP_DETAIL';
