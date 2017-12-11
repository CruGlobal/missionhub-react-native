import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigatePush } from '../../actions/navigation';
import { getStepSuggestions, addSteps } from '../../actions/steps';
import StepsList from '../../components/StepsList';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';

class SelectStepScreen extends Component {

  refreshSteps(newSteps, existingSteps) {
    if (newSteps.length !== existingSteps.length) {
      this.setState({steps: [].concat(newSteps, this.state.addedSteps)});
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      steps: props.useOthersSteps ? props.suggestedForOthers : props.suggestedForMe,
      addedSteps: [],
    };

    this.handleSelectStep = this.handleSelectStep.bind(this);
    this.handleCreateStep = this.handleCreateStep.bind(this);
    this.saveAllSteps = this.saveAllSteps.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.useOthersSteps) {
      this.refreshSteps(nextProps.suggestedForOthers, this.props.suggestedForOthers);
    } else {
      this.refreshSteps(nextProps.suggestedForMe, this.props.suggestedForMe);
    }
  }

  handleSelectStep(item) {
    const steps = this.state.steps.map((s) => s.id === item.id ? { ...s, selected: !s.selected } : s);
    this.setState({ steps });
  }

  handleCreateStep() {
    this.props.dispatch(navigatePush('AddStep', {
      onComplete: (newStepText) => {
        const addedSteps = this.state.addedSteps;

        const newStep = {
          id: `${addedSteps.length}`,
          body: newStepText,
          selected: true,
        };

        this.setState({
          steps: this.state.steps.concat([newStep]),
          addedSteps: addedSteps.concat([newStep]),
        });
      },
    }));
  }

  saveAllSteps() {
    const selectedSteps = this.state.steps.filter((s) => s.selected);
    LOG('selectedSteps', selectedSteps);
    this.props.dispatch(addSteps(selectedSteps)).then(()=>{
      // LOG(r);
    });
    // TODO: Save selected steps with some kind of API call,
    this.props.dispatch(navigatePush(this.props.nextScreen));
  }

  renderTitle() {
    return (
      <Flex value={1.5} align="center" justify="start">
        <Text type="header" style={styles.headerTitle}>Steps of Faith</Text>
        <Text style={styles.headerText}>
          {this.props.headerText}
        </Text>
      </Flex>
    );
  }

  render() {
    return (
      <Flex style={styles.container}>
        <Flex value={1} align="center" justify="center" style={styles.headerWrap}>
          <BackButton customNavigate="backToStages" />
          {this.renderTitle()}
        </Flex>
        <Flex value={2}>
          <StepsList
            items={this.state.steps}
            onSelectStep={this.handleSelectStep}
            onCreateStep={this.handleCreateStep}
          />
        </Flex>
        <Flex align="center" justify="end">
          <Button
            type="secondary"
            onPress={this.saveAllSteps}
            text="ADD TO MY STEPS"
            style={styles.addButton}
          />
        </Flex>
      </Flex>
    );
  }
}

const getThree = (arr) => {
  return [].concat([arr[0], arr[1], arr[2]]).filter(Boolean);
};

const mapStateToProps = ({ steps }) => ({
  suggestedForMe: getThree(steps.suggestedForMe),
  suggestedForOthers: getThree(steps.suggestedForOthers),
});

export default connect(mapStateToProps)(SelectStepScreen);
