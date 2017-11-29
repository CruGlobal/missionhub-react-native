import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import StepsList from '../../components/StepsList';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';

const STEPS = [
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
  {
    id: 4,
    name: 'step 4',
  },
  {
    id: 5,
    name: 'step 5',
  },
  {
    id: 6,
    name: 'step 6',
  },
  {
    id: 7,
    name: 'step 7',
  },
];

class SelectStepScreen extends Component {
  renderTitle() {
    return (
      <Flex value={1.5} align="center" justify="start">
        <Text type="header" style={styles.headerTitle}>Steps of Faith</Text>
        <Text style={styles.headerText}>
          How do you want to move forward on your spiritual journey?  
        </Text>
      </Flex>
    );
  }
  render() {
    // const { id } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex value={1} align="center" justify="center" style={styles.headerWrap}>
          <BackButton />
          {this.renderTitle()}
        </Flex>
        <Flex value={2} >
          <StepsList items={STEPS} />
        </Flex>
        <Flex align="center" justify="end">
          <Button
            type="secondary"
            onPress={() => this.props.dispatch(navigateBack())}
            text="ADD TO MY STEPS"
            style={styles.addButton}
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
