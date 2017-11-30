import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigatePush } from '../../actions/navigation';
import { getStepSuggestions } from '../../actions/steps';
import StepsList from '../../components/StepsList';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';

class SelectStepScreen extends Component {

  constructor(props) {
    super(props);

    this.handleSelectStep = this.handleSelectStep.bind(this);
    this.handleCreateStep = this.handleCreateStep.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }
  
  handleSelectStep(item) {
    LOG('step selected', item);
    // TODO: Change icon and set step to selected
  }

  handleCreateStep() {
    this.props.dispatch(navigatePush('AddStep'));
  }

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
    return (
      <Flex style={styles.container}>
        <Flex value={1} align="center" justify="center" style={styles.headerWrap}>
          <BackButton />
          {this.renderTitle()}
        </Flex>
        <Flex value={2}>
          <StepsList
            items={this.props.suggestedForMe}
            onSelectStep={this.handleSelectStep}
            onCreateStep={this.handleCreateStep}
          />
        </Flex>
        <Flex align="center" justify="end">
          <Button
            type="secondary"
            onPress={() => this.props.dispatch(navigatePush('MainTabs'))}
            text="ADD TO MY STEPS"
            style={styles.addButton}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ steps }) => ({
  suggestedForMe: steps.suggestedForMe,
  suggestedForOthers: steps.suggestedForOthers,
});

export default connect(mapStateToProps)(SelectStepScreen);
