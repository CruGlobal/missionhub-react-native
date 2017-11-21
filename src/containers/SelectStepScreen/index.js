import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import StepsList from '../../components/StepsList';
import theme from '../../theme';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';

const STEPS= [
  {
    id: 1,
    name: 'step 1',
  },
  {
    id: 2,
    name: 'step 2',
  },
  {
    id: 3,
    name: 'step 3',
  },
];

class SelectStepScreen extends Component {
  render() {
    // const { id } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex value={1} align="center" justify="center" style={styles.headerWrap}>
          <BackButton />
          <Flex value={1.5} align="center" justify="start">
            <Text type="header" style={styles.headerTitle}>Steps of Faith</Text>
            <Text style={styles.headerText}>What do you want to do to help others experience God?</Text>
          </Flex>
        </Flex>
        <Flex value={2} >
          <StepsList items={STEPS} />
        </Flex>
        <Flex style={{top: 0, bottom: 0, right: 0, left: 0}} align="center" justify="end">
          <Button
            type="secondary"
            onPress={() => this.props.dispatch(navigateBack())}
            text="ADD TO MY STEPS"
            style={{width: theme.fullWidth}}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = (undefined, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
});

export default connect(mapStateToProps)(SelectStepScreen);
